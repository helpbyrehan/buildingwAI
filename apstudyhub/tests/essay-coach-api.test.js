const {test,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/essay-coach');
const D=require('../assets/essay-coach-demo');
const originalFetch=global.fetch,originalEnv={...process.env};let calls;
beforeEach(()=>{calls=[];delete process.env.STUDY_AI_ALLOWED_ORIGINS;Object.assign(process.env,{SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'public-key',SUPABASE_SERVICE_ROLE_KEY:'service-secret',CLOUDFLARE_ACCOUNT_ID:'account',CLOUDFLARE_API_TOKEN:'provider-secret'});});
afterEach(()=>{global.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
function mock({auth=200,quota=true,rpcError=false,bad=false,modelStatus=200,refundError=false}={}){
 global.fetch=async(url,options={})=>{calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-one'},{status:auth});
  if(url.endsWith('/vercel_reserve_study_ai'))return Response.json({allowed:quota,remaining:4},{status:rpcError?500:200});
  if(url.endsWith('/vercel_refund_study_ai'))return Response.json({ok:!refundError},{status:refundError?500:200});
  if(url.includes('api.cloudflare.com'))return Response.json({success:!bad,result:{response:JSON.stringify(D.review)}},{status:modelStatus});
  throw new Error('Unexpected request');
 };
}
async function invoke(body=D.input,headers={authorization:'Bearer login-token'},method='POST'){
 const res={headers:{},code:0,body:null,setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(v){this.body=v;return this;},end(){return this;}};
 await handler({body,headers,method},res);return res;
}
test('valid review uses existing authenticated shared quota and keeps all provider credentials server-side',async()=>{
 mock();const r=await invoke();assert.equal(r.code,200);assert.deepEqual(r.body.result,D.review);assert.equal(r.body.usage.remaining,4);assert.equal(r.headers['Cache-Control'],'no-store');
 const reserve=calls.find(c=>c.url.endsWith('vercel_reserve_study_ai'));assert.equal(JSON.parse(reserve.options.body).target_user_id,'student-one');
 assert.equal(JSON.stringify(r.body).includes('provider-secret'),false);assert.equal(JSON.stringify(r.body).includes('service-secret'),false);
});
test('missing or invalid login cannot reach quota or the model',async()=>{
 mock();assert.equal((await invoke(D.input,{})).code,401);assert.equal(calls.length,0);
 mock({auth:401});assert.equal((await invoke()).code,401);assert.equal(calls.length,1);
});
test('caller-supplied reports or demo flags never bypass login or generation',async()=>{
 mock();assert.equal((await invoke({...D.input,demo:true,result:D.review},{})).code,401);assert.equal(calls.length,0);
 assert.equal((await invoke({...D.input,demo:true,result:D.review})).code,200);assert.ok(calls.some(c=>c.url.includes('api.cloudflare.com')));
});
test('invalid writing requests fail before authentication or quota',async()=>{
 mock();for(const body of [{...D.input,draft:'too short'},null,[],{...D.input,kind:'rewrite'},'{broken'])assert.ok([400,422].includes((await invoke(body)).code));assert.equal(calls.length,0);
});
test('daily allowance and unavailable quota prevent provider calls',async()=>{
 mock({quota:false});assert.equal((await invoke()).code,429);assert.equal(calls.some(c=>c.url.includes('api.cloudflare.com')),false);
 calls=[];mock({rpcError:true});assert.equal((await invoke()).code,503);assert.equal(calls.some(c=>c.url.includes('api.cloudflare.com')),false);
});
test('model failure or invalid output refunds the reserved request and never returns partial advice',async()=>{
 for(const config of [{bad:true},{modelStatus:500}]){calls=[];mock(config);const r=await invoke();assert.equal(r.code,502);assert.equal(r.body.result,undefined);assert.equal(calls.filter(c=>c.url.endsWith('vercel_refund_study_ai')).length,1);}
});
test('GitHub Pages preflight works without login or model configuration',async()=>{
 mock();delete process.env.CLOUDFLARE_API_TOKEN;const origin='https://helpbyrehan.github.io';const r=await invoke({}, {origin,'access-control-request-method':'POST','access-control-request-headers':'authorization, content-type'},'OPTIONS');
 assert.equal(r.code,204);assert.equal(r.headers['Access-Control-Allow-Origin'],origin);assert.equal(calls.length,0);
});
test('CORS blocks hostile origins and unsupported headers while allowing same-origin Vercel previews',async()=>{
 mock();for(const origin of ['https://attacker.example','https://helpbyrehan.github.io.attacker.example','null'])assert.equal((await invoke(D.input,{origin,authorization:'Bearer token'})).code,403);
 assert.equal(calls.length,0);assert.equal((await invoke(D.input,{host:'preview.vercel.app',origin:'https://preview.vercel.app',authorization:'Bearer token'})).code,200);
 assert.equal((await invoke({}, {origin:'https://helpbyrehan.github.io','access-control-request-method':'POST','access-control-request-headers':'x-api-key'},'OPTIONS')).code,403);
});
test('unsupported methods and missing setup never consume an allowance',async()=>{
 mock();assert.equal((await invoke({}, {}, 'DELETE')).code,405);delete process.env.SUPABASE_SERVICE_ROLE_KEY;assert.equal((await invoke()).code,503);assert.equal(calls.length,0);
});
test('local coach reuses login and quota without Cloudflare credentials or exposing its access key',async()=>{
 process.env.ESSAY_COACH_PROVIDER='local';process.env.ESSAY_COACH_LOCAL_URL='https://owner-tunnel.example/api/review';process.env.ESSAY_COACH_LOCAL_KEY='private-local-key-'.repeat(3);
 delete process.env.CLOUDFLARE_ACCOUNT_ID;delete process.env.CLOUDFLARE_API_TOKEN;
 mock();const upstream=global.fetch;
 global.fetch=async(url,options)=>url==='https://owner-tunnel.example/api/review'?(calls.push({url,options}),Response.json({feedback:'This draft has a concrete scene. Explain what changed in your choices after it.'})):upstream(url,options);
 const r=await invoke({...D.input,kind:'ucas_excerpt',wordLimit:650});assert.equal(r.code,200);assert.equal(r.body.result.version,'local-essay-advice-v1');
 const local=calls.find(c=>c.url.includes('owner-tunnel'));assert.equal(local.options.headers.Authorization,'Bearer '+process.env.ESSAY_COACH_LOCAL_KEY);assert.equal(JSON.parse(local.options.body).wordLimit,null);
 assert.equal(local.options.redirect,'error');assert.equal(calls.some(c=>c.url.includes('api.cloudflare.com')),false);assert.equal(JSON.stringify(r.body).includes('private-local-key'),false);
});
test('offline local coach refunds allowance and never falls back to a cloud model',async()=>{
 process.env.ESSAY_COACH_PROVIDER='local';process.env.ESSAY_COACH_LOCAL_URL='https://owner-tunnel.example/api/review';process.env.ESSAY_COACH_LOCAL_KEY='private-local-key-'.repeat(3);
 mock();const upstream=global.fetch;global.fetch=async(url,options)=>url.includes('owner-tunnel')?(calls.push({url,options}),Response.json({detail:'busy'},{status:429})):upstream(url,options);
 const r=await invoke();assert.equal(r.code,502);assert.equal(calls.filter(c=>c.url.endsWith('vercel_refund_study_ai')).length,1);assert.equal(calls.some(c=>c.url.includes('api.cloudflare.com')),false);
});
test('local provider rejects unsafe tunnel configuration before sending credentials',async()=>{
 process.env.ESSAY_COACH_PROVIDER='local';process.env.ESSAY_COACH_LOCAL_URL='http://owner-tunnel.example/api/review';process.env.ESSAY_COACH_LOCAL_KEY='private-local-key-'.repeat(3);
 mock();assert.equal((await invoke()).code,502);assert.equal(calls.some(c=>c.url.includes('owner-tunnel')),false);
});
