const {randomUUID}=require('node:crypto');
const C=require('../assets/essay-coach-contract');
const {generateEssayReview}=require('../server/essay-coach-engine');
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');
  const send=(status,detail)=>res.status(status).json({detail});
  const origin=req.headers.origin;
  const allowed=(process.env.STUDY_AI_ALLOWED_ORIGINS||'https://helpbyrehan.github.io').split(',').map(v=>v.trim()).filter(Boolean);
  const sameOrigin=req.headers.host&&origin===`https://${req.headers.host}`;
  if(origin&&!sameOrigin&&!allowed.includes(origin))return send(403,'This website is not allowed to use the essay coach.');
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Expose-Headers','X-Request-ID');}
  if(req.method==='OPTIONS'){
    const headers=(req.headers['access-control-request-headers']||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);
    if(!origin||req.headers['access-control-request-method']!=='POST'||headers.some(v=>!['authorization','content-type'].includes(v)))return send(403,'This browser request is not allowed.');
    res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.setHeader('Access-Control-Max-Age','600');return res.status(204).end();
  }
  if(req.method!=='POST'){res.setHeader('Allow','POST, OPTIONS');return send(405,'Method not allowed.');}
  const env=process.env;
  if(['SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','CLOUDFLARE_ACCOUNT_ID','CLOUDFLARE_API_TOKEN'].some(k=>!env[k]))return send(503,'Essay coach is not configured. Ask the site owner to check the existing Study AI environment variables on Vercel.');
  const authorization=req.headers.authorization||'';
  if(!/^Bearer \S+$/.test(authorization))return send(401,'Log in to get essay feedback.');
  let body=req.body,input;
  try{if(typeof body==='string')body=JSON.parse(body);}catch(_){return send(400,'Request body must be valid JSON.');}
  if(!body||typeof body!=='object'||Array.isArray(body))return send(400,'Send a JSON object with an essay draft.');
  if(Buffer.byteLength(JSON.stringify(body))>96000)return send(413,'The essay request is too large.');
  try{input=C.input(body);}catch(error){return send(422,error.message);}
  const supabase=env.SUPABASE_URL.replace(/\/$/,'');const requestId=randomUUID();let reserved=false;
  async function rpc(name,args){const response=await fetch(`${supabase}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('quota');return response.json();}
  try{
    const auth=await fetch(`${supabase}/auth/v1/user`,{headers:{apikey:env.SUPABASE_ANON_KEY,Authorization:authorization},signal:AbortSignal.timeout(8000)});
    if(!auth.ok)return send(auth.status>=500?503:401,'Could not verify your login. Please try again or log in again.');
    const user=await auth.json();if(!user.id)return send(401,'Please log in again.');
    const usage=await rpc('vercel_reserve_study_ai',{target_user_id:user.id,request_id:requestId});
    if(!usage.allowed)return send(429,'You have used today’s five AI requests shared by Study AI and Essay coach. Try again after the UTC daily reset.');
    reserved=true;
    const generated=await generateEssayReview(env,input);
    res.setHeader('X-Request-ID',requestId);
    return res.status(200).json({...generated,usage:{remaining:usage.remaining},request_id:requestId});
  }catch(error){
    if(reserved){try{await rpc('vercel_refund_study_ai',{request_id:requestId});}catch(_){console.error('Essay coach refund failed',{requestId});}}
    // Never log draft text, prompts, feedback, provider responses, or credentials.
    console.error('Essay coach request failed',{requestId,kind:error.message==='quota'?'quota':'upstream'});
    return send(error.message==='quota'?503:502,error.message==='quota'?'Could not verify your AI allowance. Ask the site owner to run supabase/vercel-study-ai.sql.':'The essay coach could not produce verified feedback. Your draft has not been changed. Please try again.');
  }
};
