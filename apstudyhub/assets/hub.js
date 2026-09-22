(function(){
  'use strict';

  const CFG=window.AP_STUDY_HUB_CONFIG||{};
  const configured=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_KEY&&window.supabase);
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const root=()=>window.APSH_BASE||'../';
  const date=v=>v?new Date(v+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'No date';
  let db=null,user=null,courses=[];

  function notify(message,type=''){
    const el=$('#hubNotice')||$('#toast');
    if(!el)return;
    el.textContent=message;
    if(el.id==='hubNotice')el.className=`notice ${type}`;
    else{el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600);}
  }

  function errorMessage(error,fallback='Something went wrong. Please try again.'){
    console.warn(error);
    return error?.message||fallback;
  }

  async function boot(){
    enhanceNavigation();
    if(!configured){showSetup();return;}
    db=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY);
    const auth=await db.auth.getUser();
    user=auth.data.user||null;
    const c=await db.from('courses').select('*').order('name');
    courses=c.data||[];
    if($('[data-dashboard]'))await dashboardPage();
    if($('[data-planner]'))await plannerPage();
    if($('[data-practice]'))await practicePage();
    if($('[data-community]'))await communityPage();
    if($('[data-classes]'))await classesPage();
    if($('[data-assistant]'))assistantPage();
    if($('[data-resource-page]'))await enhanceResourcePage();
  }

  function enhanceNavigation(){
    $$('.navlinks').forEach(nav=>{
      if(!$('[data-hub-link]',nav)){
        const a=document.createElement('a');
        a.href=root()+'dashboard/';a.dataset.hubLink='';a.textContent='My Hub';
        nav.insertBefore(a,nav.firstChild);
      }
      if(!$('[data-mobile-auth]',nav)){
        const box=document.createElement('div');box.className='mobile-auth';box.dataset.mobileAuth='';nav.append(box);
      }
    });
  }

  function showSetup(){
    $$('[data-requires-data]').forEach(el=>el.innerHTML='<div class="empty"><h3>Connect Supabase</h3><p>Add the project URL and anon key in assets/config.js, then run full-product-upgrade.sql.</p></div>');
  }

  function authRequired(){
    if(user)return true;
    const area=$('[data-auth-area]')||$('main');
    if(area)area.innerHTML=`<section class="page-head"><div class="container"><div class="eyebrow">Account required</div><h1>Make it yours.</h1><p>Log in to use your personal study hub.</p><a class="btn btn-primary" href="${root()}login/?next=${encodeURIComponent(location.pathname+location.search)}">Log in</a> <a class="btn btn-secondary" href="${root()}signup/">Create account</a></div></section>`;
    return false;
  }

  const courseName=id=>courses.find(c=>String(c.id)===String(id))?.name||'General';
  const courseOptions=(selected='')=>courses.map(c=>`<option value="${esc(c.id)}" ${String(c.id)===String(selected)?'selected':''}>${esc(c.name)}</option>`).join('');

  async function dashboardPage(){
    if(!authRequired())return;
    await db.rpc('touch_streak');
    const [uc,tasks,progress,saved,recent,attempts,streak]=await Promise.all([
      db.from('user_courses').select('*,courses(*)').eq('user_id',user.id).order('created_at'),
      db.from('study_tasks').select('*').eq('user_id',user.id).order('due_date').limit(12),
      db.from('course_progress').select('*').eq('user_id',user.id),
      db.from('saved_resources').select('resource_id').eq('user_id',user.id),
      db.from('recent_views').select('*,resources(id,title,resource_type)').eq('user_id',user.id).order('viewed_at',{ascending:false}).limit(5),
      db.from('practice_attempts').select('is_correct').eq('user_id',user.id),
      db.from('user_streaks').select('*').eq('user_id',user.id).maybeSingle()
    ]);
    const attemptsData=attempts.data||[];
    const accuracy=attemptsData.length?Math.round(100*attemptsData.filter(x=>x.is_correct).length/attemptsData.length):0;
    $('#dashGreeting').textContent=`Welcome back${user.user_metadata?.display_name?', '+user.user_metadata.display_name.split(' ')[0]:''}.`;
    $('#dashStats').innerHTML=stat('Courses',(uc.data||[]).length)+stat('Saved',(saved.data||[]).length)+stat('Accuracy',attemptsData.length?accuracy+'%':'—')+stat('Streak',(streak.data?.current_streak||1)+' day'+((streak.data?.current_streak||1)===1?'':'s'));
    renderMyCourses(uc.data||[],progress.data||[]);
    renderTasks(tasks.data||[]);
    const recentBox=$('#recentResources');
    recentBox.innerHTML=(recent.data||[]).length?(recent.data||[]).map(x=>`<a class="list-row" href="${root()}resource/?id=${encodeURIComponent(x.resource_id)}"><span><strong>${esc(x.resources?.title||'Resource')}</strong><small>${esc(x.resources?.resource_type||'Study material')}</small></span><span>Open →</span></a>`).join(''):'<div class="empty compact"><p>Resources you open will appear here.</p></div>';
    $('#addCourseForm').onsubmit=async e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget);
      const result=await db.from('user_courses').upsert({user_id:user.id,course_id:fd.get('course_id'),exam_date:fd.get('exam_date')||null,target_score:Number(fd.get('target_score'))||null});
      if(result.error)notify(errorMessage(result.error),'error');else location.reload();
    };
    $('#dashCourse').innerHTML='<option value="">Choose a course</option>'+courseOptions();
  }

  function stat(label,value){return `<div class="metric"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;}

  function renderMyCourses(items,progress){
    const box=$('#myCourses');
    box.innerHTML=items.length?items.map(x=>{
      const p=progress.filter(y=>String(y.course_id)===String(x.course_id));
      const confident=p.filter(y=>y.status==='confident').length;
      const percent=p.length?Math.round(100*confident/p.length):0;
      const days=x.exam_date?Math.ceil((new Date(x.exam_date+'T12:00:00')-new Date())/86400000):null;
      return `<article class="study-card"><div class="eyebrow">${days===null?'Set an exam date':days>=0?days+' days to exam':'Exam completed'}</div><h3>${esc(x.courses?.name||courseName(x.course_id))}</h3><div class="progress"><span style="width:${percent}%"></span></div><p>${percent}% of tracked units confident</p><a class="btn btn-small" href="${root()}planner/?course=${encodeURIComponent(x.course_id)}">Plan study →</a></article>`;
    }).join(''):'<div class="empty compact"><h3>Choose your AP courses.</h3><p>Your dashboard will organize everything around them.</p></div>';
  }

  function renderTasks(items){
    const box=$('#upcomingTasks');
    box.innerHTML=items.length?items.map(x=>`<label class="task-row ${x.completed?'done':''}"><input type="checkbox" data-task-check="${esc(x.id)}" ${x.completed?'checked':''}><span><strong>${esc(x.title)}</strong><small>${esc(courseName(x.course_id))} · ${esc(date(x.due_date))} · ${esc(x.minutes)} min</small></span></label>`).join(''):'<div class="empty compact"><p>No upcoming tasks. Build a plan when you are ready.</p></div>';
    $$('[data-task-check]').forEach(el=>el.onchange=async()=>{await db.from('study_tasks').update({completed:el.checked}).eq('id',el.dataset.taskCheck).eq('user_id',user.id);el.closest('.task-row').classList.toggle('done',el.checked);});
  }

  async function plannerPage(){
    if(!authRequired())return;
    const [uc,tasks,progress]=await Promise.all([
      db.from('user_courses').select('*,courses(*)').eq('user_id',user.id),
      db.from('study_tasks').select('*').eq('user_id',user.id).order('due_date'),
      db.from('course_progress').select('*').eq('user_id',user.id).order('unit_number')
    ]);
    const selected=new URLSearchParams(location.search).get('course')||(uc.data?.[0]?.course_id||'');
    $('#taskCourse').innerHTML='<option value="">General</option>'+courseOptions(selected);
    $('#progressCourse').innerHTML='<option value="">Choose a course</option>'+courseOptions(selected);
    $('#progressFormCourse').innerHTML='<option value="">Choose a course</option>'+courseOptions(selected);
    renderPlannerTasks(tasks.data||[]);
    renderProgress(progress.data||[],selected);
    $('#taskForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('study_tasks').insert({user_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),notes:fd.get('notes')||null,due_date:fd.get('due_date'),minutes:Number(fd.get('minutes'))});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
    $('#progressForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('course_progress').upsert({user_id:user.id,course_id:fd.get('course_id'),unit_number:Number(fd.get('unit_number')),unit_name:fd.get('unit_name')||null,status:fd.get('status'),confidence:Number(fd.get('confidence'))},{onConflict:'user_id,course_id,unit_number'});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
    $('#progressCourse').onchange=()=>renderProgress(progress.data||[],$('#progressCourse').value);
    $('#generateWeek').onclick=async()=>{
      const enrolled=uc.data||[];if(!enrolled.length){notify('Add a course from My Hub first.','error');return;}
      const start=new Date();const rows=[];
      enrolled.slice(0,4).forEach((x,i)=>{[1,3].forEach((offset,j)=>{const d=new Date(start);d.setDate(d.getDate()+offset+i);rows.push({user_id:user.id,course_id:x.course_id,title:j?'Practice questions':'Review weakest unit',due_date:d.toISOString().slice(0,10),minutes:30});});});
      const r=await db.from('study_tasks').insert(rows);if(r.error)notify(errorMessage(r.error),'error');else location.reload();
    };
  }

  function renderPlannerTasks(items){
    const box=$('#plannerTasks');
    const groups={};items.forEach(x=>(groups[x.due_date]||(groups[x.due_date]=[])).push(x));
    box.innerHTML=items.length?Object.entries(groups).map(([day,rows])=>`<section class="agenda-day"><div class="eyebrow">${esc(date(day))}</div>${rows.map(x=>`<div class="list-row"><span><strong>${esc(x.title)}</strong><small>${esc(courseName(x.course_id))} · ${esc(x.minutes)} min</small></span><button class="text-btn" data-delete-task="${esc(x.id)}" aria-label="Delete ${esc(x.title)}">Remove</button></div>`).join('')}</section>`).join(''):'<div class="empty"><h3>Your week is open.</h3><p>Add a task or generate a balanced starting plan.</p></div>';
    $$('[data-delete-task]').forEach(b=>b.onclick=async()=>{await db.from('study_tasks').delete().eq('id',b.dataset.deleteTask).eq('user_id',user.id);location.reload();});
  }

  function renderProgress(items,courseId){
    const rows=items.filter(x=>String(x.course_id)===String(courseId));
    $('#progressList').innerHTML=rows.length?rows.map(x=>`<div class="list-row"><span><strong>Unit ${esc(x.unit_number)}${x.unit_name?' · '+esc(x.unit_name):''}</strong><small>${esc(x.status.replaceAll('_',' '))} · Confidence ${esc(x.confidence)}/5</small></span><span class="status ${x.status==='confident'?'approved':x.status==='needs_review'?'rejected':'pending'}">${esc(x.status.replaceAll('_',' '))}</span></div>`).join(''):'<div class="empty compact"><p>Track units to see your confidence map.</p></div>';
  }

  async function practicePage(){
    if(!authRequired())return;
    const [questions,attempts,decks]=await Promise.all([
      db.from('practice_questions').select('*').eq('is_published',true).order('created_at'),
      db.from('practice_attempts').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
      db.from('flashcard_decks').select('*,flashcards(*)').eq('owner_id',user.id).order('updated_at',{ascending:false})
    ]);
    let bank=questions.data||[],index=0;
    $('#practiceCourse').innerHTML='<option value="">All courses</option>'+courseOptions();
    const show=()=>{
      const course=$('#practiceCourse').value,diff=$('#practiceDifficulty').value;
      const filtered=bank.filter(q=>(!course||String(q.course_id)===course)&&(!diff||q.difficulty===diff));
      if(!filtered.length){$('#questionCard').innerHTML='<div class="empty"><h3>No questions yet.</h3><p>Admins can add original questions to the practice_questions table.</p></div>';return;}
      index%=filtered.length;const q=filtered[index];
      $('#questionCard').innerHTML=`<div class="eyebrow">${esc(courseName(q.course_id))} · ${esc(q.difficulty)}</div><h2>${esc(q.prompt)}</h2><div class="answer-list">${q.choices.map((choice,i)=>`<button class="answer" data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(choice)}</button>`).join('')}</div><div id="answerExplanation" class="notice hide"></div>`;
      $$('[data-answer]').forEach(b=>b.onclick=async()=>{const chosen=Number(b.dataset.answer),correct=chosen===q.correct_index;$$('[data-answer]').forEach((x,i)=>{x.disabled=true;x.classList.toggle('correct',i===q.correct_index);x.classList.toggle('incorrect',i===chosen&&!correct);});const ex=$('#answerExplanation');ex.classList.remove('hide');ex.textContent=(correct?'Correct. ':'Not quite. ')+q.explanation;await db.from('practice_attempts').insert({user_id:user.id,question_id:q.id,selected_index:chosen,is_correct:correct});await db.rpc('touch_streak');});
      $('#nextQuestion').onclick=()=>{index++;show();};
    };
    $('#practiceCourse').onchange=show;$('#practiceDifficulty').onchange=show;show();
    const a=attempts.data||[];$('#practiceStats').innerHTML=stat('Answered',a.length)+stat('Correct',a.filter(x=>x.is_correct).length)+stat('Accuracy',a.length?Math.round(100*a.filter(x=>x.is_correct).length/a.length)+'%':'—');
    renderDecks(decks.data||[]);
    $('#deckForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const d=await db.from('flashcard_decks').insert({owner_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),is_public:fd.get('is_public')==='on'}).select().single();if(d.error){notify(errorMessage(d.error),'error');return;}const fronts=fd.getAll('front').filter(Boolean),backs=fd.getAll('back').filter(Boolean);const cards=fronts.map((front,i)=>({deck_id:d.data.id,front,back:backs[i]||'',position:i})).filter(x=>x.back);if(cards.length)await db.from('flashcards').insert(cards);location.reload();};
    $('#deckCourse').innerHTML='<option value="">General</option>'+courseOptions();
  }

  function renderDecks(items){
    $('#deckList').innerHTML=items.length?items.map(d=>`<article class="study-card"><div class="eyebrow">${esc(courseName(d.course_id))}</div><h3>${esc(d.title)}</h3><p>${d.flashcards?.length||0} cards · ${d.is_public?'Shared':'Private'}</p><button class="btn btn-small" data-study-deck="${esc(d.id)}">Study now</button></article>`).join(''):'<div class="empty compact"><p>Create a deck to start spaced review.</p></div>';
    $$('[data-study-deck]').forEach(b=>b.onclick=async()=>{const deck=items.find(d=>d.id===b.dataset.studyDeck);const card=deck?.flashcards?.[0];if(!card){notify('Add cards to this deck first.');return;}const response=prompt(card.front+'\n\nPress OK to reveal the answer.');if(response!==null){alert(card.back);await db.from('flashcard_reviews').upsert({user_id:user.id,flashcard_id:card.id,repetitions:1,interval_days:1,due_at:new Date(Date.now()+86400000).toISOString(),last_rating:2},{onConflict:'user_id,flashcard_id'});}});
  }

  async function communityPage(){
    const [collections,posts]=await Promise.all([
      db.from('collections').select('*,collection_items(count)').eq('is_public',true).order('updated_at',{ascending:false}).limit(20),
      db.from('discussion_posts').select('*,post_replies(count)').is('classroom_id',null).order('created_at',{ascending:false}).limit(30)
    ]);
    $('#collectionFeed').innerHTML=(collections.data||[]).length?(collections.data||[]).map(x=>`<article class="study-card"><div class="eyebrow">${esc(courseName(x.course_id))} · Student curated</div><h3>${esc(x.title)}</h3><p>${esc(x.description||'A community study collection.')}</p><small>${x.collection_items?.[0]?.count||0} resources</small>${user?`<button class="btn btn-small" data-save-collection="${esc(x.id)}">Save collection</button>`:''}</article>`).join(''):'<div class="empty"><h3>Be the first curator.</h3><p>Public collections will appear here.</p></div>';
    $('#discussionFeed').innerHTML=(posts.data||[]).length?(posts.data||[]).map(x=>`<article class="discussion"><div class="eyebrow">${esc(courseName(x.course_id))} · Student</div><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><small>${x.post_replies?.[0]?.count||0} replies ${x.is_resolved?'· Answered':''}</small></article>`).join(''):'<div class="empty"><h3>No questions yet.</h3><p>Start a thoughtful, course-focused discussion.</p></div>';
    if(user){
      $('#communityComposer').classList.remove('hide');
      $('#collectionCourse').innerHTML='<option value="">All courses</option>'+courseOptions();
      $('#postCourse').innerHTML='<option value="">General</option>'+courseOptions();
      $('#collectionForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('collections').insert({owner_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),description:fd.get('description'),is_public:true});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
      $('#postForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('discussion_posts').insert({author_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),body:fd.get('body')});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
      $$('[data-save-collection]').forEach(b=>b.onclick=async()=>{const r=await db.from('collection_saves').upsert({user_id:user.id,collection_id:b.dataset.saveCollection});notify(r.error?errorMessage(r.error):'Collection saved',r.error?'error':'success');});
    }
  }

  async function classesPage(){
    if(!authRequired())return;
    const [owned,memberships]=await Promise.all([
      db.from('classrooms').select('*,courses(name),classroom_members(count)').eq('owner_id',user.id),
      db.from('classroom_members').select('*,classrooms(*,courses(name))').eq('user_id',user.id)
    ]);
    const map=new Map();(owned.data||[]).forEach(x=>map.set(x.id,x));(memberships.data||[]).forEach(x=>{if(x.classrooms)map.set(x.classrooms.id,x.classrooms);});
    $('#classList').innerHTML=map.size?[...map.values()].map(x=>`<article class="study-card"><div class="eyebrow">${x.owner_id===user.id?'Teacher space':'Class member'}</div><h3>${esc(x.name)}</h3><p>${esc(x.description||x.courses?.name||'Study together')}</p>${x.owner_id===user.id?`<div class="join-code"><span>Join code</span><strong>${esc(x.join_code)}</strong></div>`:''}</article>`).join(''):'<div class="empty"><h3>No classes yet.</h3><p>Create a teacher space or join one with a code.</p></div>';
    $('#classCourse').innerHTML='<option value="">General study group</option>'+courseOptions();
    $('#createClassForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('classrooms').insert({owner_id:user.id,course_id:fd.get('course_id')||null,name:fd.get('name'),description:fd.get('description')||null}).select().single();if(r.error)notify(errorMessage(r.error),'error');else{await db.from('classroom_members').insert({classroom_id:r.data.id,user_id:user.id,member_role:'teacher'});location.reload();}};
    $('#joinClassForm').onsubmit=async e=>{e.preventDefault();const code=new FormData(e.currentTarget).get('join_code');const r=await db.rpc('join_classroom',{code});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
  }

  async function enhanceResourcePage(){
    const id=new URLSearchParams(location.search).get('id');if(!id||!db)return;
    if(user)await db.from('recent_views').upsert({user_id:user.id,resource_id:id,viewed_at:new Date().toISOString()},{onConflict:'user_id,resource_id'});
    const target=$('.resource-detail > div:first-child')||$('.resource-detail');if(!target)return;
    const quality=await db.from('resource_quality').select('*').eq('resource_id',id).maybeSingle();
    const box=document.createElement('section');box.className='resource-feedback';
    box.innerHTML=`<div class="eyebrow">Community quality</div><p>${quality.data?.helpful_percent!=null?esc(quality.data.helpful_percent)+'% found this helpful':'Be the first to rate this resource.'}</p>${user?'<div class="inline"><button class="btn btn-small" data-helpful="true">Helpful</button><button class="btn btn-small" data-helpful="false">Not helpful</button><button class="btn btn-ghost btn-small" id="reportResource">Report an issue</button></div>':'<a href="'+root()+'login/">Log in to rate or report</a>'}`;
    target.append(box);
    const tools=document.createElement('a');tools.className='btn btn-secondary btn-small';tools.href=root()+'assistant/?resource='+encodeURIComponent($('[data-resource-title]')?.textContent||'this resource');tools.textContent='Open Study Assistant →';box.append(tools);
    $$('[data-helpful]',box).forEach(b=>b.onclick=async()=>{const r=await db.from('resource_feedback').upsert({user_id:user.id,resource_id:id,helpful:b.dataset.helpful==='true'},{onConflict:'user_id,resource_id'});notify(r.error?errorMessage(r.error):'Thanks for your feedback',r.error?'error':'success');});
    if($('#reportResource'))$('#reportResource').onclick=async()=>{const reason=prompt('Issue type: broken, outdated, incorrect, copyright, unsafe, or other');if(!reason)return;if(!['broken','outdated','incorrect','copyright','unsafe','other'].includes(reason.toLowerCase())){notify('Choose one of the listed issue types.','error');return;}const details=prompt('Optional details')||'';const r=await db.from('resource_reports').insert({user_id:user.id,resource_id:id,reason:reason.toLowerCase(),details});notify(r.error?errorMessage(r.error):'Report sent for review',r.error?'error':'success');};
  }

  function assistantPage(){
    const resource=new URLSearchParams(location.search).get('resource');
    if(resource)$('#assistantTopic').value=resource;
    const sentences=text=>text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).filter(x=>x.length>20);
    const keywords=text=>{
      const stop=new Set('about after again also because been before being between could every first from have into just more most other over should some such than that their them then there these they this through very what when where which while will with would your'.split(' '));
      const counts={};(text.toLowerCase().match(/[a-z][a-z-]{3,}/g)||[]).forEach(w=>{if(!stop.has(w))counts[w]=(counts[w]||0)+1;});
      return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]);
    };
    $('#assistantForm').onsubmit=e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget),text=String(fd.get('notes')||'').trim(),mode=fd.get('mode'),topic=fd.get('topic')||'your topic';
      if(text.length<40){notify('Add at least a few sentences of notes.','error');return;}
      const s=sentences(text),keys=keywords(text);let html='';
      if(mode==='summary')html=`<h2>Focused summary</h2><p>${esc((s.slice(0,Math.min(4,s.length)).join(' ')||text).slice(0,900))}</p><div class="chips">${keys.map(k=>`<span class="chip">${esc(k)}</span>`).join('')}</div>`;
      if(mode==='explain')html=`<h2>Explain ${esc(topic)}</h2><p>Start with this core idea: ${esc(s[0]||text.slice(0,400))}</p><p class="muted">Connect it to ${esc(keys.slice(0,3).join(', ')||'the main terms')}. Then explain one cause, one effect, and one concrete example in your own words.</p>`;
      if(mode==='quiz')html=`<h2>Self-quiz</h2><ol>${(keys.length?keys:['main idea','evidence','application']).slice(0,6).map((k,i)=>`<li>${i%2?`How does ${esc(k)} connect to ${esc(keys[0]||topic)}?`:`Define ${esc(k)} without looking at your notes, then give an example.`}</li>`).join('')}</ol>`;
      if(mode==='cards')html=`<h2>Flashcard draft</h2>${(keys.length?keys:['main idea']).slice(0,8).map(k=>`<div class="list-row"><span><strong>${esc(k)}</strong><small>Write the definition, importance, and one example from your notes.</small></span></div>`).join('')}`;
      $('#assistantOutput').innerHTML=html;$('#assistantOutput').classList.remove('hide');
    };
  }

  document.addEventListener('DOMContentLoaded',()=>boot().catch(err=>notify(errorMessage(err),'error')));
})();
