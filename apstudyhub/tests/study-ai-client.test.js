const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {endpoint,generate}=require('../assets/study-ai-client');
const api='https://buildingwai-apstudyhub.vercel.app/api/study-ai';
const githubOrigin='https://helpbyrehan.github.io';

function config(hostname){
  const context={window:{location:{hostname}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/config.js'),'utf8'),context);
  return context.window.AP_STUDY_HUB_CONFIG;
}
test('actual browser config routes GitHub Pages to Vercel and keeps previews same-origin',()=>{
  assert.equal(endpoint(config('helpbyrehan.github.io').STUDY_AI_API_URL,githubOrigin),api);
  for(const host of ['buildingwai-apstudyhub.vercel.app','trusted-preview.vercel.app']){
    assert.equal(endpoint(config(host).STUDY_AI_API_URL,'https://'+host),'https://'+host+'/api/study-ai');
  }
});
test('credentials are never sent to insecure or credential-bearing API URLs',()=>{
  for(const url of ['http://backend.example/api/study-ai','https://user:pass@backend.example/api/study-ai',api+'?token=secret',api+'#secret']){
    assert.throws(()=>endpoint(url,githubOrigin),/secure API address/);
  }
  assert.equal(endpoint('/api/study-ai','http://localhost:8080'),'http://localhost:8080/api/study-ai');
});
test('generation sends only the login token and notes to the configured backend',async()=>{
  const body={mode:'summary',content:'Example notes'};
  let observed;
  const payload={result:{mode:'summary',summary:'A sample summary.'},usage:{remaining:4}};
  const result=await generate({apiUrl:api,pageOrigin:githubOrigin,accessToken:'test-login-token',body,fetchImpl:async(url,options)=>{observed={url,options};return Response.json(payload);}});
  assert.equal(observed.url,api);
  assert.equal(observed.options.headers.Authorization,'Bearer test-login-token');
  assert.equal(observed.options.redirect,'error');
  assert.equal(observed.options.credentials,'omit');
  assert.deepEqual(JSON.parse(observed.options.body),body);
  assert.deepEqual(result,payload);
});
test('missing login stops before any request',async()=>{
  await assert.rejects(generate({apiUrl:api,pageOrigin:githubOrigin,fetchImpl:()=>assert.fail('must not fetch')}),/log in again/);
});
test('static-host errors and invalid JSON have an actionable deployment message',async()=>{
  for(const response of [new Response('<html>Not found</html>',{status:404,headers:{'Content-Type':'text/html'}}),new Response('{broken',{headers:{'Content-Type':'application/json'}})]){
    await assert.rejects(generate({apiUrl:api,pageOrigin:githubOrigin,accessToken:'test',fetchImpl:async()=>response}),/check the API deployment/);
  }
});
test('backend login and quota errors remain visible',async()=>{
  for(const [status,detail] of [[401,'Log in to use Study AI.'],[429,'Daily limit reached.'],[503,'Study AI is not configured.']]){
    await assert.rejects(generate({apiUrl:api,pageOrigin:githubOrigin,accessToken:'test',fetchImpl:async()=>Response.json({detail},{status})}),error=>error.message===detail);
  }
});
test('network and timeout failures have distinct messages without leaking request details',async()=>{
  for(const [name,pattern] of [['TypeError',/Could not reach Study AI/],['TimeoutError',/took too long/]]){
    await assert.rejects(generate({apiUrl:api,pageOrigin:githubOrigin,accessToken:'test',fetchImpl:async()=>{const error=new Error('secret internal details');error.name=name;throw error;}}),error=>pattern.test(error.message)&&!error.message.includes('secret'));
  }
});
