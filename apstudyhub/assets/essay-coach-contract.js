(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.EssayCoach=factory();})(typeof window!=='undefined'?window:this,function(){
  'use strict';
  const VERSION='essay-coach-v1';
  const LOCAL_VERSION='local-essay-advice-v1';
  const RUBRIC={prompt:'Prompt alignment',specificity:'Specific detail',reflection:'Reflection & insight',voice:'Personal voice',structure:'Structure & focus',clarity:'Clarity & economy'};
  const LEVELS={needs_work:'Needs work',developing:'Developing',strong:'Strong',not_assessed:'Not enough context'};
  const KINDS={personal:'US personal essay',supplement:'US college supplement',ucas:'UCAS · three responses',ucas_excerpt:'UCAS · one response or excerpt',scholarship:'Scholarship essay',other:'Other application response'};
  const FOCUS={balanced:'Full review',reflection:'Reflection & meaning',structure:'Structure & focus',clarity:'Clarity & concision',voice:'Personal voice'};
  const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
  const words=v=>String(v||'').trim().match(/\S+/gu)?.length||0;
  const paragraphs=v=>String(v).trim().split(/\n\s*\n/).filter(p=>p.trim());
  function input(value){
    if(!record(value))throw new Error('Send an essay and its context.');
    function text(v,max,label,min=0){if(v==null)v='';if(typeof v!=='string'||v.trim().length<min||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))throw new Error(label+' is missing, too long, or contains unsupported characters.');return v.replace(/\r\n?/g,'\n').trim();}
    const draft=text(value.draft,16000,'Essay draft',80),prompt=text(value.prompt,4000,'Essay prompt'),focus=value.focus||'balanced',kind=value.kind||'personal';
    if(!Object.hasOwn(FOCUS,focus)||!Object.hasOwn(KINDS,kind))throw new Error('Choose a supported essay type and review focus.');
    const limit=kind.startsWith('ucas')||value.wordLimit===''||value.wordLimit==null?null:Number(value.wordLimit);
    if(limit!==null&&(!Number.isInteger(limit)||limit<1||limit>20000))throw new Error('Use a whole-number word limit from 1 to 20,000, or leave it blank.');
    return {draft,prompt,focus,kind,wordLimit:limit};
  }
  function findQuote(draft,quote){
    if(typeof quote!=='string'||!quote.trim())return null;
    const pattern=quote.trim().split(/\s+/u).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
    const match=new RegExp(pattern,'u').exec(draft);
    return match?{start:match.index,end:match.index+match[0].length,text:match[0]}:null;
  }
  function validateReview(value,context){
    if(record(value)&&value.version===LOCAL_VERSION){
      return typeof value.feedback==='string'&&value.feedback.trim().length>=32&&value.feedback.length<=12000&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.feedback)?[]:['Local feedback must be bounded plain text.'];
    }
    const errors=[];if(!record(value))return ['Feedback must be an object.'];
    if(value.version!==VERSION)errors.push('Wrong feedback version.');
    function text(v,label,max,min=1){if(typeof v!=='string'||v.trim().length<min||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v||''))errors.push(label+' must be plain text of '+min+'–'+max+' characters.');}
    function quote(v,label,draft=context.draft){text(v,label,240,12);if(typeof v==='string'&&!findQuote(draft,v))errors.push(label+' must be a verbatim excerpt from the supplied draft.');}
    function list(v,label,min,max){if(!Array.isArray(v)||v.length<min||v.length>max){errors.push(label+' must contain '+min+'–'+max+' items.');return [];}return v;}
    text(value.summary,'summary',600);
    const criteria=list(value.criteria,'criteria',6,6),keys=new Set();
    criteria.forEach((r,i)=>{
      if(!record(r)){errors.push('Invalid criterion.');return;}
      if(!Object.hasOwn(RUBRIC,r.key)||keys.has(r.key))errors.push('Each rubric criterion must appear exactly once.');keys.add(r.key);
      if(!Object.hasOwn(LEVELS,r.level))errors.push('Invalid rubric level.');
      text(r.observation,'criterion observation',450);text(r.next_step,'criterion next step',350);
      if(r.level==='not_assessed'&&r.quote===''){}else quote(r.quote,'criterion quote');
      if(r.key==='prompt'&&!context.prompt&&r.level!=='not_assessed')errors.push('Prompt alignment cannot be assessed without a prompt.');
    });
    const strengths=list(value.strengths,'strengths',0,3);strengths.forEach(r=>{if(!record(r)){errors.push('Invalid strength.');return;}text(r.point,'strength',350);quote(r.quote,'strength quote');});
    const priorities=list(value.priorities,'priorities',1,3);priorities.forEach(r=>{if(!record(r)){errors.push('Invalid priority.');return;}text(r.issue,'priority issue',250);text(r.why,'priority explanation',350);text(r.action,'priority action',400);quote(r.quote,'priority quote');});
    const parts=paragraphs(context.draft);
    const notes=list(value.paragraph_notes,'paragraph_notes',0,6);notes.forEach(r=>{if(!record(r)){errors.push('Invalid paragraph note.');return;}if(!Number.isInteger(r.paragraph)||r.paragraph<1||r.paragraph>parts.length)errors.push('Paragraph number is outside the draft.');else quote(r.quote,'paragraph quote',parts[r.paragraph-1]);text(r.advice,'paragraph advice',400);});
    const questions=list(value.questions,'questions',1,3);questions.forEach(q=>text(q,'reflection question',240));
    const advice=[value.summary,...criteria.flatMap(r=>[r?.observation,r?.next_step]),...strengths.map(r=>r?.point),...priorities.flatMap(r=>[r?.issue,r?.why,r?.action]),...notes.map(r=>r?.advice),...questions].join(' ');
    if(/\b(?:you will (?:be admitted|be accepted|get in)|guaranteed (?:admission|acceptance)|(?:admission|acceptance) (?:chance|probability|odds)\s*(?:is|of|:)\s*\d+|\d+\s*%\s*(?:chance|odds) of (?:admission|acceptance))\b/i.test(advice))errors.push('Do not predict admission outcomes.');
    if(/\b(?:here(?:'s| is) (?:your|a) (?:rewritten|replacement|new) (?:essay|paragraph)|(?:replace|rewrite) (?:it|this|the paragraph) (?:with|as)\s*:)/i.test(advice))errors.push('Give advice, not replacement essay prose.');
    if(!keys.size||JSON.stringify(value).length>16000)errors.push('Feedback is missing or too long.');
    return errors;
  }
  function selectReview(value){
    if(value.version===LOCAL_VERSION)return {version:LOCAL_VERSION,feedback:value.feedback};
    return {version:VERSION,summary:value.summary,criteria:value.criteria.map(r=>({key:r.key,level:r.level,observation:r.observation,next_step:r.next_step,quote:r.quote})),strengths:value.strengths.map(r=>({point:r.point,quote:r.quote})),priorities:value.priorities.map(r=>({issue:r.issue,why:r.why,action:r.action,quote:r.quote})),paragraph_notes:value.paragraph_notes.map(r=>({paragraph:r.paragraph,quote:r.quote,advice:r.advice})),questions:value.questions.slice()};
  }
  function endpoint(configuredUrl,pageOrigin){
    let url;try{url=new URL(configuredUrl||'/api/essay-coach',pageOrigin);}catch(_){throw new Error('Essay coach has an invalid API address. Ask the site owner to check its configuration.');}
    const local=url.origin===pageOrigin&&['localhost','127.0.0.1','[::1]'].includes(url.hostname);
    if((url.protocol!=='https:'&&!local)||url.username||url.password||url.search||url.hash)throw new Error('Essay coach needs a secure API address without credentials.');
    return url.href;
  }
  async function reviewEssay({apiUrl,pageOrigin,accessToken,body,fetchImpl=fetch}){
    if(!accessToken)throw new Error('Log in to get essay feedback.');
    const context=input(body),url=endpoint(apiUrl,pageOrigin);let response;
    try{response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+accessToken},body:JSON.stringify(context),credentials:'omit',redirect:'error',signal:AbortSignal.timeout(110000)});}
    catch(error){throw new Error(error?.name==='AbortError'||error?.name==='TimeoutError'?'The essay review took too long. Your draft is still here; try again.':'Could not reach the essay coach. Your draft is still here. Check your connection and try again.');}
    const json=(response.headers.get('content-type')||'').toLowerCase().includes('application/json');
    const payload=json?await response.json().catch(()=>null):null;
    if(!payload)throw new Error('The essay coach API is not available on this deployment. Ask the site owner to deploy /api/essay-coach on Vercel.');
    if(!response.ok)throw new Error(typeof payload.detail==='string'?payload.detail:'Essay feedback could not be completed. Please try again.');
    const errors=validateReview(payload.result,context);
    if(errors.length)throw new Error('The feedback could not be verified against your draft. Please try again.');
    return {...payload,result:selectReview(payload.result)};
  }
  return {VERSION,LOCAL_VERSION,RUBRIC,LEVELS,KINDS,FOCUS,input,words,paragraphs,findQuote,validateReview,selectReview,endpoint,reviewEssay};
});
