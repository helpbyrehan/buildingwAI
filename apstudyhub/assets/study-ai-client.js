(function(root,factory){
  const client=factory();
  if(typeof module==='object'&&module.exports)module.exports=client;
  else root.APStudyAI=client;
})(typeof window==='object'?window:this,function(){
  'use strict';

  function endpoint(configuredUrl,pageOrigin){
    let url;
    try{url=new URL(configuredUrl||'/api/study-ai',pageOrigin);}
    catch{throw new Error('Study AI is not configured correctly. Ask the site owner to check the API address.');}
    const local=url.origin===pageOrigin&&['localhost','127.0.0.1','[::1]'].includes(url.hostname);
    if((url.protocol!=='https:'&&!local)||url.username||url.password||url.search||url.hash){
      throw new Error('Study AI needs a secure API address. Ask the site owner to check the configuration.');
    }
    return url.href;
  }

  async function generate({apiUrl,pageOrigin,accessToken,body,fetchImpl=fetch}){
    if(!accessToken)throw new Error('Please log in again to use Study AI.');
    const url=endpoint(apiUrl,pageOrigin);
    let response;
    try{
      response=await fetchImpl(url,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+accessToken},
        body:JSON.stringify(body),
        // Never forward a login token to a redirected destination.
        redirect:'error',
        credentials:'omit',
        signal:AbortSignal.timeout(110000)
      });
    }catch(error){
      if(error?.name==='TimeoutError'||error?.name==='AbortError'){
        throw new Error('Study AI took too long to respond. Please try again.');
      }
      throw new Error('Could not reach Study AI. Check your connection and try again. If this continues, ask the site owner to check the API connection.');
    }
    const isJson=(response.headers.get('Content-Type')||'').toLowerCase().includes('application/json');
    const payload=isJson?await response.json().catch(()=>null):null;
    if(!payload){
      throw new Error('Study AI did not return a study result. Ask the site owner to check the API deployment.');
    }
    if(!response.ok){
      throw new Error(typeof payload.detail==='string'?payload.detail:'Study AI could not complete this request. Please try again.');
    }
    return payload;
  }

  return {endpoint,generate};
});
