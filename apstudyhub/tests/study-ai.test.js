const {test, beforeEach, afterEach} = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/study-ai');
const originalFetch = global.fetch;
const originalEnv = {...process.env};
const summary = {mode:'summary',title:'Cells',summary:'Cells are the basic units of life and contain organelles that carry out specific functions.',key_terms:[],warnings:[]};
let calls;
beforeEach(()=>{
  calls=[];
  Object.assign(process.env,{SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'secret',CLOUDFLARE_ACCOUNT_ID:'account',CLOUDFLARE_API_TOKEN:'ai-secret'});
});
afterEach(()=>{global.fetch=originalFetch;process.env=Object.assign({},originalEnv);});
function mock({auth=200,allowed=true,result=summary,provider=200,quota=200}={}) {
  global.fetch=async(url,options)=>{
    calls.push({url,options});
    if(url.endsWith('/auth/v1/user')) return Response.json({id:'user-id'},{status:auth});
    if(url.endsWith('/vercel_reserve_study_ai')) return Response.json({allowed,remaining:4},{status:quota});
    if(url.endsWith('/vercel_refund_study_ai')) return Response.json({ok:true});
    return Response.json({success:true,result:{response:JSON.stringify(result)}},{status:provider});
  };
}
async function invoke(body={},headers={authorization:'Bearer token'},method='POST') {
  const req={method,headers,body:{mode:'summary',course:'Biology',content:'Cells are the basic unit of life. They contain organelles.',...body}};
  const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(data){this.data=data;return this;}};
  await handler(req,res);return res;
}
test('authenticated summary returns expected UI contract without secrets',async()=>{mock();const r=await invoke();assert.equal(r.code,200);assert.deepEqual(r.data.result,summary);assert.equal(r.data.usage.remaining,4);assert.ok(!JSON.stringify(r.data).includes('secret'));});
test('missing token and invalid login cannot reach AI or quota',async()=>{mock({auth:401});assert.equal((await invoke({},{})).code,401);assert.equal(calls.length,0);assert.equal((await invoke()).code,401);assert.equal(calls.length,1);});
test('bad input and unsupported methods are rejected before requests',async()=>{mock();assert.equal((await invoke({content:'short'})).code,422);assert.equal((await invoke({mode:'unknown'})).code,422);assert.equal((await invoke({},undefined,'GET')).code,405);assert.equal(calls.length,0);});
test('daily limit prevents provider call',async()=>{mock({allowed:false});assert.equal((await invoke()).code,429);assert.equal(calls.length,2);});
test('quota setup failure fails closed',async()=>{mock({quota:404});assert.equal((await invoke()).code,503);assert.equal(calls.length,2);});
test('provider failure refunds reservation',async()=>{mock({provider:503});assert.equal((await invoke()).code,502);assert.ok(calls.at(-1).url.endsWith('/vercel_refund_study_ai'));});
test('malformed model output retries once then refunds',async()=>{mock({result:{mode:'summary'}});assert.equal((await invoke()).code,502);assert.equal(calls.filter(c=>c.url.includes('api.cloudflare.com')).length,2);assert.ok(calls.at(-1).url.endsWith('/vercel_refund_study_ai'));});
test('quiz and flashcards keep existing renderer shape',async()=>{for(const [mode,result] of [['quiz',{mode:'quiz',title:'Quiz',questions:[{question:'What is a cell?',choices:['A unit of life','A planet','A rock','An atom'],correct_index:0,explanation:'Cells are units of life.'}]}],['flashcards',{mode:'flashcards',title:'Cards',cards:[{front:'Cell',back:'A unit of life'}]}]]) {mock({result});assert.equal((await invoke({mode,options:{count:1}})).code,200);}});
test('duplicate quiz choices are rejected',async()=>{mock({result:{mode:'quiz',title:'Quiz',questions:[{question:'Q?',choices:['same','Same','other','last'],correct_index:0,explanation:'Text'}]}});assert.equal((await invoke({mode:'quiz',options:{count:1}})).code,502);});
