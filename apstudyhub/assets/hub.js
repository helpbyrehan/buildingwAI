(function(){
  'use strict';

  const CFG=window.AP_STUDY_HUB_CONFIG||{};
  const runtime=window.AP_STUDY_HUB_RUNTIME||(window.AP_STUDY_HUB_RUNTIME={});
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
    const featurePage=$('[data-dashboard],[data-planner],[data-practice],[data-community],[data-classes],[data-assistant],[data-resource-page],[data-admin]');
    if(!featurePage)return;
    if(!configured){showSetup();return;}
    db=runtime.supabaseClient||window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY);
    runtime.supabaseClient=db;
    if(!runtime.userPromise){
      runtime.userPromise=db.auth.getUser()
        .then(auth=>auth.data.user||null)
        .catch(error=>{console.warn(error);return null;});
    }
    user=await runtime.userPromise;
    const needsCourses=$('[data-dashboard],[data-planner],[data-practice],[data-community],[data-classes]');
    if(needsCourses){
      const c=await db.from('courses').select('*').order('name');
      courses=c.data||[];
    }
    if($('[data-dashboard]'))await dashboardPage();
    if($('[data-planner]'))await plannerPage();
    if($('[data-practice]'))await practicePage();
    if($('[data-community]'))await communityPage();
    if($('[data-classes]'))await classesPage();
    if($('[data-assistant]'))assistantPage();
    if($('[data-resource-page]'))await enhanceResourcePage();
    if($('[data-admin]'))await teacherAdminPage();
  }

  function enhanceNavigation(){
    $$('.navlinks').forEach(nav=>{
      const hasHubLink=$$('a',nav).some(link=>/\/(dashboard|hub)\/?(?:[?#].*)?$/.test(link.getAttribute('href')||''));
      if(!$('[data-hub-link]',nav)&&!hasHubLink){
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
    const collectionFeed=$('#collectionFeed'), discussionFeed=$('#discussionFeed');
    if(collections.error)notify(errorMessage(collections.error),'error');
    if(posts.error)notify(errorMessage(posts.error),'error');
    collectionFeed.innerHTML=collections.error?'<div class="empty"><p>Collections could not be loaded.</p></div>':(collections.data||[]).length?(collections.data||[]).map(x=>`<article class="study-card"><div class="eyebrow">${esc(courseName(x.course_id))} · Student curated</div><h3>${esc(x.title)}</h3><p>${esc(x.description||'A community study collection.')}</p><small>${x.collection_items?.[0]?.count||0} resources</small>${user?`<button class="btn btn-small" data-save-collection="${esc(x.id)}">Save collection</button>`:''}</article>`).join(''):'<div class="empty"><h3>Be the first curator.</h3><p>Public collections will appear here.</p></div>';
    discussionFeed.innerHTML=posts.error?'<div class="empty"><p>Questions could not be loaded.</p></div>':(posts.data||[]).length?(posts.data||[]).map(x=>`<article class="discussion" data-discussion="${esc(x.id)}"><div class="eyebrow">${esc(courseName(x.course_id))} · Community question</div><h3>${esc(x.title)}</h3><p class="discussion-body">${esc(x.body)}</p><div class="discussion-actions"><small>${x.post_replies?.[0]?.count||0} replies ${x.is_resolved?'· Answered':''}</small><button class="btn btn-secondary btn-small" type="button" data-open-discussion="${esc(x.id)}" aria-expanded="false">View replies / Reply →</button></div><div class="discussion-thread hide" data-thread="${esc(x.id)}"></div></article>`).join(''):'<div class="empty"><h3>No questions yet.</h3><p>Start a thoughtful, course-focused discussion.</p></div>';

    $$('[data-open-discussion]',discussionFeed).forEach(button=>button.addEventListener('click',async()=>{
      const id=button.dataset.openDiscussion;
      const thread=$('[data-thread="'+id+'"]',discussionFeed);
      const opening=thread.classList.contains('hide');
      thread.classList.toggle('hide',!opening);
      button.setAttribute('aria-expanded',String(opening));
      button.textContent=opening?'Hide replies ↑':'View replies / Reply →';
      if(opening)await renderReplies(id,thread);
    }));
    if(user){
      $('#communityComposer').classList.remove('hide');
      $('#collectionCourse').innerHTML='<option value="">All courses</option>'+courseOptions();
      $('#postCourse').innerHTML='<option value="">General</option>'+courseOptions();
      $('#collectionForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('collections').insert({owner_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),description:fd.get('description'),is_public:true});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
      $('#postForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await db.from('discussion_posts').insert({author_id:user.id,course_id:fd.get('course_id')||null,title:fd.get('title'),body:fd.get('body')});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
      $$('[data-save-collection]').forEach(b=>b.onclick=async()=>{const r=await db.from('collection_saves').upsert({user_id:user.id,collection_id:b.dataset.saveCollection});notify(r.error?errorMessage(r.error):'Collection saved',r.error?'error':'success');});
    }
  }

  async function renderReplies(postId,thread){
    thread.innerHTML='<p class="muted">Loading replies…</p>';
    const result=await db.from('post_replies').select('id,author_id,body,created_at').eq('post_id',postId).order('created_at',{ascending:true});
    if(result.error){thread.innerHTML=`<div class="notice error">${esc(errorMessage(result.error))}</div>`;return;}
    thread.innerHTML=`<div class="reply-list">${(result.data||[]).length?(result.data||[]).map(x=>`<div class="discussion-reply"><div class="eyebrow">${x.author_id===user?.id?'You':'Community member'} · ${esc(new Date(x.created_at).toLocaleDateString())}</div><p>${esc(x.body)}</p></div>`).join(''):'<p class="muted">No replies yet. Start the discussion.</p>'}</div>${user?`<form class="reply-form" data-reply-form><label for="reply-${esc(postId)}">Your reply</label><textarea id="reply-${esc(postId)}" name="body" class="textarea" minlength="2" maxlength="3000" rows="3" placeholder="Share a useful explanation or ask a follow-up question" required></textarea><button class="btn btn-primary btn-small" type="submit">Post reply</button></form>`:`<p class="help"><a href="${root()}login/?next=${encodeURIComponent(location.pathname+location.search)}">Log in to reply.</a></p>`}`;
    const form=$('[data-reply-form]',thread);
    if(form)form.onsubmit=async e=>{
      e.preventDefault();
      const body=String(new FormData(form).get('body')||'').trim();
      if(body.length<2){notify('Please write a reply before posting.','error');return;}
      const send=$('button[type="submit"]',form);send.disabled=true;
      const r=await db.from('post_replies').insert({post_id:postId,author_id:user.id,body});
      send.disabled=false;
      if(r.error){notify(errorMessage(r.error),'error');return;}
      const count=$('[data-discussion="'+postId+'"] small',document);
      if(count){const n=parseInt(count.textContent,10)||0;count.textContent=(n+1)+' replies';}
      await renderReplies(postId,thread);
      notify('Reply posted','success');
    };
  }

  async function classesPage(){
    if(!authRequired())return;
    const [owned,memberships,role,application]=await Promise.all([
      db.from('classrooms').select('*,courses(name),classroom_members(count)').eq('owner_id',user.id),
      db.from('classroom_members').select('*,classrooms(*,courses(name))').eq('user_id',user.id),
      db.rpc('is_approved_teacher'),
      db.from('teacher_applications').select('status,submitted_at').eq('user_id',user.id).maybeSingle()
    ]);
    if(role.error||application.error){
      notify('Teacher permissions could not be checked. Run teacher-approval.sql in Supabase, then reload.','error');
    }
    const canCreate=!role.error&&role.data===true;
    const map=new Map();(owned.data||[]).forEach(x=>map.set(x.id,x));(memberships.data||[]).forEach(x=>{if(x.classrooms)map.set(x.classrooms.id,x.classrooms);});
    $('#classList').innerHTML=map.size?[...map.values()].map(x=>`<article class="study-card"><div class="eyebrow">${x.owner_id===user.id?'Your class':'Class member'}</div><h3>${esc(x.name)}</h3><p>${esc(x.description||x.courses?.name||'Study together')}</p>${x.owner_id===user.id?`<div class="join-code"><span>Join code</span><strong>${esc(x.join_code)}</strong></div>`:''}</article>`).join(''):'<div class="empty"><h3>No classes yet.</h3><p>Join a teacher-led class with a code.</p></div>';
    if(owned.error||memberships.error)notify(errorMessage(owned.error||memberships.error),'error');
    $('#classCourse').innerHTML='<option value="">General study group</option>'+courseOptions();
    const create=$('#createClassForm'),applicationPanel=$('#teacherApplicationPanel'),form=$('#teacherApplicationForm'),status=$('#teacherApplicationStatus');
    create.classList.toggle('hide',!canCreate);
    if(canCreate){
      applicationPanel.classList.add('hide');
      create.querySelector('.eyebrow').textContent='Approved teachers & admins';
    }else{
      applicationPanel.classList.remove('hide');
      form.classList.toggle('hide',!!application.data||!!role.error||!!application.error);
      status.textContent=role.error||application.error?'Teacher applications are temporarily unavailable. Ask an admin to run teacher-approval.sql.':application.data?.status==='pending'?'Your teacher application is awaiting an admin review.':application.data?.status==='rejected'?'Your teacher application was not approved. Contact an admin if you have questions.':application.data?.status==='approved'?'Teacher approval is pending a permission refresh. Please reload.':'Apply to become an approved teacher before creating a class.';
      form.onsubmit=async e=>{
        e.preventDefault();const reason=String(new FormData(form).get('statement')||'').trim();
        if(reason.length<20){notify('Please include at least 20 characters about your teaching experience.','error');return;}
        const button=form.querySelector('button[type="submit"]');button.disabled=true;
        const r=await db.from('teacher_applications').insert({user_id:user.id,statement:reason});
        button.disabled=false;
        if(r.error)notify(errorMessage(r.error),'error');else{status.textContent='Application submitted. An admin will review it.';form.classList.add('hide');notify('Application submitted','success');}
      };
    }
    create.onsubmit=async e=>{
      e.preventDefault();
      if(!canCreate){notify('Only approved teachers and admins can create classes.','error');return;}
      const fd=new FormData(create),button=create.querySelector('button[type="submit"]');button.disabled=true;
      const r=await db.from('classrooms').insert({owner_id:user.id,course_id:fd.get('course_id')||null,name:fd.get('name'),description:fd.get('description')||null}).select().single();
      button.disabled=false;
      if(r.error){notify(errorMessage(r.error),'error');return;}
      const membership=await db.from('classroom_members').insert({classroom_id:r.data.id,user_id:user.id,member_role:'teacher'});
      if(membership.error)notify('Class created, but membership setup failed: '+errorMessage(membership.error),'error');
      else location.reload();
    };
    $('#joinClassForm').onsubmit=async e=>{e.preventDefault();const code=new FormData(e.currentTarget).get('join_code');const r=await db.rpc('join_classroom',{code});if(r.error)notify(errorMessage(r.error),'error');else location.reload();};
  }

  async function teacherAdminPage(){
    if(!user)return;
    const box=$('#teacherApplications');if(!box)return;
    const profile=await db.from('profiles').select('role').eq('id',user.id).maybeSingle();
    if(profile.error||profile.data?.role!=='admin')return;
    box.classList.remove('hide');
    const r=await db.from('teacher_applications').select('user_id,statement,status,submitted_at').eq('status','pending').order('submitted_at',{ascending:true});
    if(r.error){box.innerHTML=`<div class="notice error">${esc(errorMessage(r.error))}. Run teacher-approval.sql if this feature is not installed.</div>`;return;}
    box.innerHTML=`<div class="eyebrow">Teacher rank</div><h2>Teacher applications</h2>${(r.data||[]).length?(r.data||[]).map(x=>`<article class="teacher-application"><div class="eyebrow">Submitted ${esc(new Date(x.submitted_at).toLocaleDateString())}</div><p>${esc(x.statement)}</p><div class="feedback-actions"><button class="btn btn-primary btn-small" data-review-teacher="approved" data-applicant="${esc(x.user_id)}">Approve teacher</button><button class="btn btn-secondary btn-small" data-review-teacher="rejected" data-applicant="${esc(x.user_id)}">Reject</button></div></article>`).join(''):'<p class="muted">No pending applications.</p>'}`;
    $$('[data-review-teacher]',box).forEach(button=>button.onclick=async()=>{
      const approve=button.dataset.reviewTeacher==='approved';
      if(!confirm((approve?'Approve':'Reject')+' this teacher application?'))return;
      button.disabled=true;
      const review=await db.rpc('review_teacher_application',{applicant:button.dataset.applicant,decision:button.dataset.reviewTeacher});
      if(review.error){button.disabled=false;notify(errorMessage(review.error),'error');}
      else{notify(approve?'Teacher approved':'Application rejected','success');await teacherAdminPage();}
    });
  }

  async function enhanceResourcePage(){
    const id=new URLSearchParams(location.search).get('id');if(!id||!db||!/^\d+$/.test(id))return;
    const target=$('.resource-detail');if(!target||$('#resourceFeedback'))return;
    if(user){const recent=await db.from('recent_views').upsert({user_id:user.id,resource_id:id,viewed_at:new Date().toISOString()},{onConflict:'user_id,resource_id'});if(recent.error)console.warn('Recent view not recorded:',recent.error);}
    const quality=await db.from('resource_quality').select('*').eq('resource_id',id).maybeSingle();
    const box=document.createElement('section');box.className='resource-feedback';box.id='resourceFeedback';
    const percent=quality.data?.helpful_percent;
    box.innerHTML=`<div class="eyebrow">Community quality</div><p class="quality-summary">${percent!=null?esc(percent)+'% found this helpful':'Be the first to rate this resource.'}</p>${user?'<div class="feedback-actions"><button class="btn btn-secondary btn-small" type="button" data-helpful="true">Helpful</button><button class="btn btn-secondary btn-small" type="button" data-helpful="false">Not helpful</button><button class="btn btn-ghost btn-small" type="button" id="reportResource">Report an issue</button></div>':'<p class="help"><a href="'+root()+'login/">Log in to rate or report</a></p>'}<a class="btn btn-secondary btn-small assistant-link" id="resourceAssistant" href="${root()}assistant/">Open Study Assistant →</a>`;
    target.append(box);
    const assistant=$('#resourceAssistant');
    const title=$('[data-resource-title]');
    if(title&&title.textContent!=='Loading…')assistant.href=root()+'assistant/?resource='+encodeURIComponent(title.textContent);
    else if(title){const observer=new MutationObserver(()=>{if(title.textContent!=='Loading…'){assistant.href=root()+'assistant/?resource='+encodeURIComponent(title.textContent);observer.disconnect();}});observer.observe(title,{childList:true,characterData:true,subtree:true});}
    $$('[data-helpful]',box).forEach(b=>b.onclick=async()=>{
      const r=await db.from('resource_feedback').upsert({user_id:user.id,resource_id:id,helpful:b.dataset.helpful==='true'},{onConflict:'user_id,resource_id'});
      if(r.error){notify(errorMessage(r.error),'error');return;}
      $$('[data-helpful]',box).forEach(el=>{const selected=el===b;el.classList.toggle('btn-primary',selected);el.classList.toggle('btn-secondary',!selected);el.setAttribute('aria-pressed',String(selected));});
      const qualityUpdate=await db.from('resource_quality').select('helpful_percent').eq('resource_id',id).maybeSingle();
      if(!qualityUpdate.error&&qualityUpdate.data?.helpful_percent!=null)$('.quality-summary',box).textContent=qualityUpdate.data.helpful_percent+'% found this helpful';
      notify('Thanks for your feedback','success');
    });
    if($('#reportResource'))$('#reportResource').onclick=async()=>{const reason=prompt('Issue type: broken, outdated, incorrect, copyright, unsafe, or other');if(!reason)return;if(!['broken','outdated','incorrect','copyright','unsafe','other'].includes(reason.toLowerCase().trim())){notify('Choose one of the listed issue types.','error');return;}const details=prompt('Optional details')||'';const r=await db.from('resource_reports').insert({user_id:user.id,resource_id:id,reason:reason.toLowerCase().trim(),details});notify(r.error?errorMessage(r.error):'Report sent for review',r.error?'error':'success');};
  }

  function assistantPage(){
    if(!authRequired())return;
    const form=$('#assistantForm'),output=$('#assistantOutput'),submit=$('#assistantSubmit');
    const notes=$('#assistantNotes'),mode=$('#assistantMode'),count=$('#assistantCount');
    const countLabel=$('#assistantCountLabel'),characterCount=$('#assistantCharacterCount');
    const resource=new URLSearchParams(location.search).get('resource');
    if(resource)$('#assistantTopic').value=resource;

    const aiText=value=>String(value??'')
      .replace(/\u000c\s*rac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/gi,'($1)/($2)')
      .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/gi,'($1)/($2)')
      .replace(/\u0009\s*ext\s*\{([^{}]+)\}/gi,'$1')
      .replace(/\\text\s*\{([^{}]+)\}/gi,'$1')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,' ')
      .replace(/[ \t]{2,}/g,' ')
      .trim();

    const syncCountField=()=>{
      if(mode.value==='summary'){
        countLabel.textContent='Summary sentences';count.min='2';count.max='10';
        if(Number(count.value)<2||Number(count.value)>10)count.value='5';
      }else if(mode.value==='quiz'){
        countLabel.textContent='Questions';count.min='1';count.max='10';
        if(Number(count.value)<1||Number(count.value)>10)count.value='5';
      }else{
        countLabel.textContent='Flashcards';count.min='1';count.max='20';
        if(Number(count.value)<1||Number(count.value)>20)count.value='8';
      }
    };
    const syncCharacterCount=()=>{characterCount.textContent=`${notes.value.length.toLocaleString()} / 12,000`;};
    mode.onchange=syncCountField;notes.oninput=syncCharacterCount;syncCountField();syncCharacterCount();

    form.onsubmit=async e=>{
      e.preventDefault();
      const fd=new FormData(form),content=String(fd.get('notes')||'').trim();
      if(content.length<40){notify('Add at least 40 characters of notes.','error');notes.focus();return;}
      if(content.length>12000){notify('Shorten the notes to 12,000 characters or fewer.','error');notes.focus();return;}

      submit.disabled=true;submit.textContent='Study AI is working…';
      output.classList.remove('hide');
      output.innerHTML='<div class="assistant-loading"><span class="assistant-spinner" aria-hidden="true"></span><div><h2>Creating your study aid…</h2><p class="muted">This usually takes a few seconds.</p></div></div>';
      const progressTimers=[
        setTimeout(()=>{const p=$('.assistant-loading p',output);if(p)p.textContent='The AI is reading and checking your notes…';},12000),
        setTimeout(()=>{const p=$('.assistant-loading p',output);if(p)p.textContent='Still working — complex quizzes can take a little longer.';},35000),
        setTimeout(()=>{const p=$('.assistant-loading p',output);if(p)p.textContent='Running final quality checks…';},65000)
      ];

      const selectedMode=String(fd.get('mode'));
      const selectedCount=Math.max(1,Number(fd.get('count'))||5);
      const requestBody={
        mode:selectedMode,
        course:String(fd.get('topic')||'General').trim(),
        content,
        options:{
          difficulty:String(fd.get('difficulty')||'medium'),
          count:selectedCount,
          max_summary_sentences:selectedMode==='summary'?selectedCount:5
        }
      };

      try{
        const response=await db.functions.invoke('study-ai',{body:requestBody});
        if(response.error){
          let message=response.error.message||'Study AI could not complete this request.';
          try{const details=await response.error.context?.json();message=details?.detail||message;}catch(_error){}
          throw new Error(message);
        }
        renderAssistantResult(response.data);
      }catch(error){
        output.innerHTML=`<div class="empty compact"><h3>Study AI is unavailable</h3><p>${esc(errorMessage(error,'Please try again shortly.'))}</p></div>`;
      }finally{
        progressTimers.forEach(timer=>clearTimeout(timer));
        submit.disabled=false;submit.textContent='Generate with Study AI';
      }
    };

    function renderAssistantResult(payload){
      const result=payload?.result||{};
      const remaining=payload?.usage?.remaining;
      let body='';

      if(result.mode==='summary'){
        const terms=(result.key_terms||[]).map(item=>`<div class="ai-term"><strong>${esc(aiText(item.term))}</strong><span>${esc(aiText(item.definition))}</span></div>`).join('');
        body=`<div class="eyebrow">Focused summary</div><h2>${esc(aiText(result.title||'Your summary'))}</h2><p class="ai-summary">${esc(aiText(result.summary||''))}</p>${terms?`<div class="ai-terms"><h3>Key terms</h3>${terms}</div>`:''}`;
      }else if(result.mode==='quiz'){
        const questions=(result.questions||[]).map((question,index)=>`<section class="ai-question" data-quiz-question><h3><span>${index+1}</span>${esc(aiText(question.question))}</h3><div class="ai-choices">${(question.choices||[]).map((choice,choiceIndex)=>`<button class="ai-choice" type="button" data-choice="${choiceIndex}" data-correct="${question.correct_index}">${esc(aiText(choice))}</button>`).join('')}</div><p class="ai-explanation hide">${esc(aiText(question.explanation))}</p></section>`).join('');
        body=`<div class="eyebrow">Self-checking quiz</div><h2>${esc(aiText(result.title||'Your quiz'))}</h2>${questions}`;
      }else if(result.mode==='flashcards'){
        const cards=(result.cards||[]).map((card,index)=>`<details class="ai-card"><summary><span>Card ${index+1}</span>${esc(aiText(card.front))}</summary><div>${esc(aiText(card.back))}</div></details>`).join('');
        body=`<div class="eyebrow">Flashcards</div><h2>${esc(aiText(result.title||'Your flashcards'))}</h2><p class="muted">Tap a card to reveal the answer.</p>${cards}`;
      }else{
        throw new Error('Study AI returned an unfamiliar response.');
      }

      const warnings=(result.warnings||[]).map(warning=>`<li>${esc(aiText(warning))}</li>`).join('');
      output.innerHTML=`${body}${warnings?`<div class="ai-warning"><strong>Check the source</strong><ul>${warnings}</ul></div>`:''}<div class="ai-result-footer"><span>${Number.isInteger(remaining)?`${remaining} generation${remaining===1?'':'s'} left today`:'Generated by AP Study Hub AI'}</span><button class="btn btn-secondary btn-small" type="button" id="copyAssistantResult">Copy result</button></div>`;

      $$('[data-quiz-question]',output).forEach(question=>{
        $$('.ai-choice',question).forEach(choice=>choice.onclick=()=>{
          if(question.dataset.answered)return;
          question.dataset.answered='true';
          const chosen=Number(choice.dataset.choice),correct=Number(choice.dataset.correct);
          $$('.ai-choice',question).forEach((button,index)=>{
            button.disabled=true;
            if(index===correct)button.classList.add('correct');
            else if(index===chosen)button.classList.add('incorrect');
          });
          $('.ai-explanation',question)?.classList.remove('hide');
        });
      });
      $('#copyAssistantResult').onclick=async()=>{
        try{await navigator.clipboard.writeText(output.innerText.replace(/Copy result\s*$/,'').trim());notify('Study aid copied','success');}
        catch(_error){notify('Could not copy automatically. Select the result and copy it manually.','error');}
      };
    }
  }

  document.addEventListener('DOMContentLoaded',()=>boot().catch(err=>notify(errorMessage(err),'error')));
})();
