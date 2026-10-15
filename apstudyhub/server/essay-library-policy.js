const C=require('../assets/essay-coach-contract');
function checkLibrary(examples){
  if(!Array.isArray(examples)||examples.length>320)throw new Error('Keep the reviewed example library bounded to 320 entries.');
  const ids=new Set(),excerpts=new Set();
  for(const e of examples){
    if(!e||typeof e.id!=='string'||!/^[-a-z0-9]{3,80}$/.test(e.id)||ids.has(e.id))throw new Error('Example IDs must be unique.');ids.add(e.id);
    if(!Array.isArray(e.traits)||!e.traits.length||e.traits.some(t=>!Object.hasOwn(C.RUBRIC,t))||!Object.hasOwn(C.KINDS,e.kind))throw new Error('Examples need supported rubric labels and an essay type.');
    for(const name of ['weaker','stronger','commentary']){
      if(typeof e[name]!=='string'||e[name].trim().length<20||e[name].length>4000)throw new Error('Example excerpts and commentary must be meaningful and bounded.');
    }
    for(const text of [e.weaker,e.stronger]){const normalized=text.toLowerCase().replace(/\s+/g,' ').trim();if(excerpts.has(normalized))throw new Error('Duplicate teaching excerpt.');excerpts.add(normalized);}
    if(e.origin==='project_original_synthetic'){
      if(e.rights!=='project-original'||e.usage!=='prompt_reference')throw new Error('Synthetic examples need original-work provenance.');
    }else if(e.origin==='permissioned_human'){
      if(e.rights!=='written-permission'||e.usage!=='prompt_reference'||e.consent_confirmed!==true||e.privacy_reviewed!==true||e.humanValidated!==true||typeof e.permission_reference!=='string'||!e.permission_reference.trim()||typeof e.reviewer_reference!=='string'||!e.reviewer_reference.trim())throw new Error('Human excerpts need written permission, consent, privacy review, and a reviewer reference before use.');
    }else throw new Error('Unverified or scraped examples cannot enter the prompt library.');
  }
  return {pairs:examples.length,excerpts:excerpts.size,synthetic:examples.filter(e=>e.origin==='project_original_synthetic').length,permissioned:examples.filter(e=>e.origin==='permissioned_human').length};
}
module.exports={checkLibrary};
