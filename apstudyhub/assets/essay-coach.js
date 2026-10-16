(function(){
  'use strict';
  const C=window.EssayCoach,D=window.EssayCoachDemo;
  if(!C||!document.querySelector('[data-essay-coach]'))return;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const options=obj=>Object.entries(obj).map(([value,label])=>`<option value="${esc(value)}">${esc(label)}</option>`).join('');
  const emptyMarkup=$('#coachFeedbackBody').innerHTML;
  let user=null,db=null,key='',busy=false,touched=false,review=null,reviewContext=null,receipt=null,anchors=[],saveTimer,checkingAccount=true;
  const fields=['coachKind','coachFocus','coachPrompt','coachDraft','coachLimit'];
  const read=()=>({kind:$('#coachKind').value,focus:$('#coachFocus').value,prompt:$('#coachPrompt').value,draft:$('#coachDraft').value,wordLimit:$('#coachKind').value.startsWith('ucas')||$('#coachLimit').value===''?null:Number($('#coachLimit').value)});
  const signature=v=>JSON.stringify({kind:v.kind,focus:v.focus,prompt:v.prompt.trim(),draft:v.draft.replace(/\r\n?/g,'\n').trim(),wordLimit:v.wordLimit});
  const stale=()=>!!reviewContext&&signature(read())!==signature(reviewContext);
  function notice(message){const box=$('#coachNotice');box.classList.remove('hide');box.textContent=message;}
  function fill(v){$('#coachKind').value=v.kind;$('#coachFocus').value=v.focus;$('#coachPrompt').value=v.prompt;$('#coachDraft').value=v.draft;$('#coachLimit').value=v.wordLimit??'';updateEditor();}
  function authStatus(remaining){
    const element=$('#coachAuthStatus');
    if(checkingAccount){element.textContent='Checking your account…';return;}
    if(!user){element.innerHTML=`<a href="${window.APSH_BASE||'../'}login/?next=${encodeURIComponent(location.pathname)}">Log in before requesting feedback</a>. You can explore the example without an account.`;}
    else element.textContent=(Number.isInteger(remaining)?remaining+' AI request'+(remaining===1?'':'s')+' remaining today. ':'')+'Essay coach and Study AI share an allowance of up to five requests per UTC day.';
    $('#coachSubmit').disabled=busy||checkingAccount;
  }
  function saveSession(){
    if(!key)return;
    try{sessionStorage.setItem(key,JSON.stringify({input:read(),review,reviewContext,receipt}));$('#coachSaveState').textContent='Kept in this tab’s session';}
    catch(_){$('#coachSaveState').textContent='Session storage unavailable · download a copy';}
  }
  function updateEditor(){
    const value=read(),count=C.words(value.draft),over=value.wordLimit&&count>value.wordLimit;
    $('#coachWordCount').textContent=count+(value.wordLimit?' / '+value.wordLimit:'')+' words'+(over?' · over limit':'');$('#coachWordCount').classList.toggle('is-over',!!over);
    if(value.kind.startsWith('ucas')){
      $('#coachWordCount').textContent=value.draft.length+' characters in editor · includes typed headings';
      $('#coachWordCount').classList.remove('is-over');
    }
    $('#coachLimit').disabled=value.kind.startsWith('ucas');
    $('#coachDownloadDraft').disabled=!value.draft.trim();
    const warning=$('#coachStale');if(warning)warning.hidden=!stale();
    $$('[data-coach-quote]').forEach(button=>button.disabled=stale());
  }
  function evidence(quote){if(!quote)return '';const index=anchors.push(quote)-1;return `<blockquote class="coach-evidence">${esc(quote)}</blockquote><button class="coach-locate" type="button" data-coach-quote="${index}"${stale()?' disabled':''}>Locate in draft ↗</button>`;}
  function renderReview(){
    if(!review){$('#coachFeedbackBody').innerHTML=emptyMarkup;return;}
    anchors=[];
    if(review.version===C.LOCAL_VERSION){
      $('#coachFeedbackBody').innerHTML=`<div class="coach-report-banner">AI writing feedback · Experimental coach trained on synthetic UK/US practice examples.</div><div class="coach-stale" id="coachStale"${stale()?'':' hidden'}>Your draft or context has changed. This feedback refers to the earlier version.</div><div class="coach-local-advice" style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(review.feedback)}</div><div class="coach-report-actions"><button type="button" class="btn btn-secondary btn-small" id="coachDownloadReview">Download feedback ↓</button></div><p class="coach-allowance">Check the advice against your draft. This is not an official grade or an admission prediction.</p>`;
      $('#coachDownloadReview').onclick=downloadReview;updateEditor();return;
    }
    const demo=receipt?.demo;
    $('#coachFeedbackBody').innerHTML=`<div class="coach-report-banner${demo?' is-example':''}">${demo?'Example feedback · prepared demonstration. No AI request was made.':'AI writing feedback · '+esc(new Date(receipt?.createdAt||Date.now()).toLocaleString())+' · Verify the advice before using it.'}</div><div class="coach-stale" id="coachStale"${stale()?'':' hidden'}>Your draft or context has changed since this review. Get fresh feedback for this version. This report still refers to the earlier draft.</div><p class="coach-report-summary">${esc(review.summary)}</p><section class="coach-report-section"><h3>What to revise first</h3><ol class="coach-priorities">${review.priorities.map(p=>`<li class="coach-feedback-item"><h4>${esc(p.issue)}</h4><p>${esc(p.why)}</p>${evidence(p.quote)}<p><strong>Your next step:</strong> ${esc(p.action)}</p></li>`).join('')}</ol></section><section class="coach-report-section"><h3>A closer look at the craft</h3><div class="coach-criteria">${review.criteria.map(r=>`<details class="coach-criterion"><summary>${esc(C.RUBRIC[r.key])}<span class="coach-level level-${r.level}">${esc(C.LEVELS[r.level])}</span></summary><p>${esc(r.observation)}</p>${evidence(r.quote)}<p><strong>Try next:</strong> ${esc(r.next_step)}</p></details>`).join('')}</div></section>${review.strengths.length?`<section class="coach-report-section"><h3>Keep what is working</h3>${review.strengths.map(s=>`<div class="coach-feedback-item coach-strength"><p>${esc(s.point)}</p>${evidence(s.quote)}</div>`).join('')}</section>`:''}${review.paragraph_notes.length?`<section class="coach-report-section"><h3>Notes in the margins</h3>${review.paragraph_notes.map(p=>`<div class="coach-feedback-item coach-paragraph-note"><strong>Paragraph ${p.paragraph}</strong>${evidence(p.quote)}<p>${esc(p.advice)}</p></div>`).join('')}</section>`:''}<section class="coach-report-section"><h3>Questions worth sitting with</h3><ol class="coach-reflection-questions">${review.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></section><div class="coach-report-actions"><button type="button" class="btn btn-secondary btn-small" id="coachDownloadReview">Download feedback ↓</button></div><p class="coach-allowance">These levels describe writing under this rubric. They are not an official grade or an admission prediction.</p>`;
    $('#coachDownloadReview').onclick=downloadReview;updateEditor();
  }
  function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  function downloadReview(){
    if(!review)return;
    if(review.version===C.LOCAL_VERSION){
      download(['AP Study Hub — Essay coach','Experimental AI feedback; not expert reviewed',review.feedback,'','DRAFT VERSION REVIEWED',reviewContext.draft,'','This download includes private draft text.'].join('\n'),'essay-feedback-'+new Date().toISOString().slice(0,10)+'.txt','text/plain;charset=utf-8');return;
    }
    const lines=['AP Study Hub — Essay coach',receipt?.demo?'Prepared demonstration — fictional draft':'AI writing feedback, not an admission prediction',`Reviewed: ${receipt?.createdAt||''}`,`Essay type: ${C.KINDS[reviewContext.kind]}`,`Prompt: ${reviewContext.prompt||'Not supplied'}`,`Word count: ${C.words(reviewContext.draft)}`,`Word limit: ${reviewContext.wordLimit||'Not set'}`,'',review.summary,'','REVISION PRIORITIES'];
    review.priorities.forEach((p,i)=>lines.push(`${i+1}. ${p.issue}`,p.why,'Draft excerpt: '+p.quote,'Next step: '+p.action,''));
    lines.push('RUBRIC');review.criteria.forEach(r=>lines.push(C.RUBRIC[r.key]+': '+C.LEVELS[r.level],r.observation,'Draft excerpt: '+r.quote,'Next step: '+r.next_step,''));
    lines.push('STRENGTHS');review.strengths.forEach(s=>lines.push(s.point,'Draft excerpt: '+s.quote,''));
    lines.push('PARAGRAPH NOTES');review.paragraph_notes.forEach(p=>lines.push('Paragraph '+p.paragraph,'Draft excerpt: '+p.quote,p.advice,''));
    lines.push('REFLECTION QUESTIONS',...review.questions,'','DRAFT VERSION REVIEWED',reviewContext.draft,'','This report includes private draft text. Keep it somewhere you trust.');
    download(lines.join('\n'),'essay-feedback-'+new Date().toISOString().slice(0,10)+'.txt','text/plain;charset=utf-8');
  }
  async function example(){
    if(busy)return;
    if($('#coachDraft').value.trim()&&$('#coachDraft').value.trim()!==D.input.draft.trim()){
      const dialog=$('#coachReplaceDialog');dialog.showModal();const answer=await new Promise(resolve=>{
        function finish(value){dialog.close();$('#coachReplaceCancel').onclick=null;$('#coachReplaceAccept').onclick=null;dialog.removeEventListener('cancel',cancel);resolve(value);}
        function cancel(e){e.preventDefault();finish(false);}
        $('#coachReplaceCancel').onclick=()=>finish(false);$('#coachReplaceAccept').onclick=()=>finish(true);dialog.addEventListener('cancel',cancel);$('#coachReplaceCancel').focus();
      });if(!answer)return;
    }
    touched=true;fill(D.input);review=C.selectReview(D.review);reviewContext=C.input(D.input);receipt={demo:true,createdAt:new Date().toISOString()};renderReview();saveSession();$('#coachFormError').textContent='';notice(D.notice);
  }
  function restoreSession(){
    if(touched){saveSession();return;}
    try{
      const raw=sessionStorage.getItem(key);if(!raw)return;
      const saved=JSON.parse(raw),v=saved.input;
      if(!v||typeof v.draft!=='string'||v.draft.length>16000||typeof v.prompt!=='string'||v.prompt.length>4000||!Object.hasOwn(C.KINDS,v.kind)||!Object.hasOwn(C.FOCUS,v.focus))return;
      fill(v);
      if(saved.review&&saved.reviewContext){const context=C.input(saved.reviewContext);if(!C.validateReview(saved.review,context).length){review=C.selectReview(saved.review);reviewContext=context;receipt={demo:!!saved.receipt?.demo,createdAt:saved.receipt?.createdAt||new Date().toISOString()};renderReview();}}
    }catch(_){notice('A previous tab-session draft could not be restored. Saved essays in your college tracker are unchanged.');}
  }
  function receiveHandoff(){
    try{
      const raw=sessionStorage.getItem('apsh-essay-coach-handoff');if(!raw)return;
      const handoff=JSON.parse(raw);if(handoff.owner!==(user?.id||'guest')||Date.now()-handoff.createdAt>600000)return;
      const value=C.input(handoff.input);fill(value);review=null;reviewContext=null;receipt=null;renderReview();sessionStorage.removeItem('apsh-essay-coach-handoff');saveSession();notice('Your saved essay is ready for review. Only the draft and prompt shown here will be sent when you request advice.');
    }catch(_){notice('The essay could not be transferred. Your saved draft is still in College applications.');}
  }
  async function submit(event){
    event.preventDefault();if(busy)return;
    if(checkingAccount){notice('Your account is still loading. Your draft is safe here.');return;}
    if(!user||!db){notice('Log in before requesting AI feedback. You can use the example review without an account. Download your draft before switching accounts if you want a separate copy.');return;}
    let context;
    try{context=C.input(read());}catch(error){$('#coachFormError').textContent=error.message;return;}
    busy=true;$('#coachFormError').textContent='';$('#coachSubmit').textContent='Reading your draft…';authStatus();$('#coachExample').disabled=true;$('#coachFeedback').setAttribute('aria-busy','true');
    $('#coachFeedbackBody').innerHTML='<div class="coach-pending" role="status"><span class="assistant-spinner" aria-hidden="true"></span><div><h3>Reading for what matters.</h3><p>The coach is checking your draft against the rubric and grounding its advice in your own words. This can take a minute.</p></div></div>';saveSession();
    try{
      const auth=await db.auth.getSession();const token=auth.data?.session?.access_token;
      const result=await C.reviewEssay({apiUrl:window.AP_STUDY_HUB_CONFIG?.ESSAY_COACH_API_URL,pageOrigin:location.origin,accessToken:token,body:context});
      review=result.result;reviewContext=context;receipt={demo:false,createdAt:new Date().toISOString(),requestId:result.request_id||'',model:result.model||'',inputHash:result.input_hash||''};renderReview();saveSession();authStatus(result.usage?.remaining);notice('Your feedback is ready. Start with the highest-impact revision and keep the writing your own.');
    }catch(error){renderReview();$('#coachFormError').textContent=error.message;}
    finally{busy=false;$('#coachSubmit').textContent='Get essay advice ↗';$('#coachSubmit').disabled=false;$('#coachExample').disabled=false;$('#coachFeedback').setAttribute('aria-busy','false');}
  }
  async function init(){
    $('#coachKind').innerHTML=options(C.KINDS);$('#coachFocus').innerHTML=options(C.FOCUS);
    fields.forEach(id=>$('#'+id).addEventListener('input',()=>{touched=true;updateEditor();clearTimeout(saveTimer);saveTimer=setTimeout(saveSession,250);}));
    $('#coachExample').onclick=example;$('#essayCoachForm').onsubmit=submit;$('#coachDownloadDraft').onclick=()=>download($('#coachDraft').value,'essay-draft.txt','text/plain;charset=utf-8');
    $('#coachFeedbackBody').addEventListener('click',event=>{
      const button=event.target.closest('[data-coach-quote]');if(!button||stale())return;
      const match=C.findQuote($('#coachDraft').value,anchors[Number(button.dataset.coachQuote)]);if(!match)return;
      const field=$('#coachDraft');field.focus();field.setSelectionRange(match.start,match.end);field.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='paused'?'auto':'smooth',block:'center'});
    });
    updateEditor();
    const runtime=window.AP_STUDY_HUB_RUNTIME||{};db=runtime.supabaseClient||null;
    try{user=runtime.userPromise?await runtime.userPromise:null;}catch(_){user=null;}
    checkingAccount=false;key='apsh-essay-coach-session:v1:'+(user?.id||'guest');restoreSession();receiveHandoff();authStatus();
    if(db)db.auth.onAuthStateChange((_event,session)=>{if((session?.user?.id||null)!==(user?.id||null)){saveSession();location.reload();}});
    window.addEventListener('pagehide',saveSession);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().catch(()=>notice('The essay coach could not open. Reload the page to try again.')));else init().catch(()=>notice('The essay coach could not open. Reload the page to try again.'));
})();
