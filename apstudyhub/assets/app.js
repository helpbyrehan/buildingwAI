(() => {
  const cfg = window.SUPABASE_CONFIG || {};
  const hasSupabase = Boolean(cfg.url && cfg.anonKey && window.supabase);
  const client = hasSupabase ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  const $ = id => document.getElementById(id);
  const state = { resources: [], courses: [], subjects: [], user: null, source: 'file', saved: new Set(JSON.parse(localStorage.getItem('apsh_saved') || '[]')) };

  const aliases = { psych:'psychology', phys:'physics', calc:'calculus', chem:'chemistry', bio:'biology', csa:'computer science a', csp:'computer science principles' };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = s => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),2200); }
  function openPanel(html){ $('panelContent').innerHTML=html; $('overlay').classList.add('open'); }
  function closePanel(){ $('overlay').classList.remove('open'); }
  function panelTitle(kicker,title,body=''){ return `<div class="kicker mono">${esc(kicker)}</div><h2>${title}</h2>${body}`; }

  function normalizeResource(r){
    return { ...r,
      id:r.id,
      title:r.title || 'Untitled resource',
      description:r.description || '',
      year:r.year || '',
      unit:r.unit_name || r.unit || '',
      type:r.resource_type || r.type || 'Other',
      file_path:r.file_path || null,
      external_url:r.external_url || null,
      course:r.course?.name || r.course_name || r.course || 'Course',
      subject:r.subject?.name || r.subject_name || r.subject || 'Subject',
      created_at:r.created_at || '',
      status:r.status || (r.approved === false ? 'pending' : 'approved'),
      submitted_by:r.submitted_by
    };
  }

  async function loadData(){
    if(!client){
      state.courses=[]; state.subjects=[]; state.resources=[];
      renderAll(); toast('Connect Supabase in config.js to load the live library.'); return;
    }
    try{
      const [subjectsRes,coursesRes,resourcesRes] = await Promise.all([
        client.from('subjects').select('*').order('name'),
        client.from('courses').select('*').order('name'),
        client.from('resources').select('*').eq('status','approved').order('created_at',{ascending:false})
      ]);
      if(subjectsRes.error) throw subjectsRes.error;
      if(coursesRes.error) throw coursesRes.error;
      if(resourcesRes.error) throw resourcesRes.error;
      state.subjects=subjectsRes.data||[];
      state.courses=coursesRes.data||[];
      state.resources=(resourcesRes.data||[]).map(normalizeResource);
      renderAll();
    }catch(e){
      console.error(e); state.resources=[]; renderAll(); toast('Could not load the resource library. Check your Supabase tables and RLS.');
    }
  }

  function renderCourses(){
    const box=$('courseList');
    if(!state.courses.length){ box.innerHTML='<div class="empty">No courses are available yet.</div>'; return; }
    box.innerHTML=state.courses.map((c,i)=>{
      const subject=state.subjects.find(s=>String(s.id)===String(c.subject_id) || String(s.subjectid)===String(c.subject_id));
      return `<div class="course" data-course="${esc(c.name)}"><span class="num mono">${String(i+1).padStart(2,'0')}</span><h3>${esc(c.name.replace(/^AP /,''))}</h3><small>${esc(subject?.name||'AP Course')}</small></div>`;
    }).join('');
    box.querySelectorAll('.course').forEach(el=>el.addEventListener('click',()=>{
      $('courseFilter').value=el.dataset.course; renderResults(); $('search').scrollIntoView({behavior:'smooth'});
    }));
  }

  function fillFilters(){
    const sf=$('subjectFilter'),cf=$('courseFilter'),yf=$('yearFilter'),tf=$('typeFilter');
    sf.innerHTML='<option value="">All subjects</option>'+state.subjects.map(s=>`<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('');
    cf.innerHTML='<option value="">All courses</option>'+state.courses.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    const years=[...new Set(state.resources.map(r=>r.year).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
    yf.innerHTML='<option value="">All years</option>'+years.map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('');
    const types=[...new Set(state.resources.map(r=>r.type).filter(Boolean))].sort();
    tf.innerHTML='<option value="">All types</option>'+types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('');
  }

  function searchResources(){
    const raw=$('searchInput').value.trim().toLowerCase(); const term=aliases[raw]||raw;
    const sf=$('subjectFilter').value.toLowerCase(), cf=$('courseFilter').value.toLowerCase(), yf=$('yearFilter').value, tf=$('typeFilter').value.toLowerCase();
    return state.resources.filter(r=>{
      const hay=[r.title,r.description,r.course,r.subject,r.unit,r.type].join(' ').toLowerCase();
      return (!term || hay.includes(term)) && (!sf || r.subject.toLowerCase()===sf) && (!cf || r.course.toLowerCase()===cf) && (!yf || String(r.year)===yf) && (!tf || r.type.toLowerCase()===tf);
    }).slice(0,12);
  }

  function renderResults(){
    const box=$('results'), found=searchResources();
    if(!found.length){box.innerHTML='<p class="empty">Nothing found. Try another course, unit, or resource type.</p>'; return;}
    box.innerHTML=found.map(r=>`<div class="result" data-resource="${esc(r.id)}"><div><b>${esc(r.title)}</b><div class="status">${esc(r.course)} · ${esc(r.unit||'Full course')}</div></div><span>${esc(r.type)}</span></div>`).join('');
    box.querySelectorAll('.result').forEach(el=>el.addEventListener('click',()=>openResource(el.dataset.resource)));
  }

  function renderFeature(){
    const r=state.resources[0];
    if(!r){ $('featureTitle').innerHTML='Find something<br>useful.'; $('featureDescription').textContent='Approved resources will appear here once they are added to the library.'; $('featureMeta').textContent='AP STUDY HUB / RESOURCE LIBRARY'; $('featureNumber').textContent='01'; return; }
    $('featureNumber').textContent='01'; $('featureMeta').textContent=`${r.course} / ${r.unit || 'FULL COURSE'} / ${r.type}`.toUpperCase(); $('featureTitle').innerHTML=esc(r.title).replace(/\s+/g,' ').replace(/^(.{0,24})\s/,'$1<br>'); $('featureDescription').textContent=r.description||'Open this resource to view its details.'; $('featureOpen').onclick=()=>openResource(r.id);
  }

  function renderAll(){ renderCourses(); fillFilters(); renderResults(); renderFeature(); }

  async function openResource(id){
    const r=state.resources.find(x=>String(x.id)===String(id)); if(!r)return;
    const saved=state.saved.has(String(id));
    const source=r.file_path ? `<button class="action" id="openFile">Open PDF / file ↗</button>` : r.external_url ? `<button class="action" id="openExternal">Open external resource ↗</button>` : '';
    openPanel(panelTitle('Resource',esc(r.title),`<p>${esc(r.description)}</p><div class="result"><b>${esc(r.course)}</b><span>${esc(r.year||'')}</span></div><div class="result"><b>${esc(r.unit||'Full Course')}</b><span>${esc(r.type)}</span></div><button class="action" id="saveResource">${saved?'★ Saved':'☆ Save resource'}</button>${source}`));
    $('saveResource').onclick=()=>{ if(state.saved.has(String(id)))state.saved.delete(String(id)); else state.saved.add(String(id)); localStorage.setItem('apsh_saved',JSON.stringify([...state.saved])); $('saveResource').textContent=state.saved.has(String(id))?'★ Saved':'☆ Save resource'; };
    if(r.external_url) $('openExternal').onclick=()=>window.open(r.external_url,'_blank','noopener,noreferrer');
    if(r.file_path) $('openFile').onclick=async()=>{ if(!client)return toast('Connect Supabase Storage first.'); const {data,error}=client.storage.from(cfg.storageBucket||'ap-resources').getPublicUrl(r.file_path); if(error||!data?.publicUrl)return toast('Could not open the file.'); window.open(data.publicUrl,'_blank','noopener,noreferrer'); };
  }

  function loginPanel(){
    openPanel(panelTitle('Account','LOG<br>IN.',`<form id="loginForm"><div class="field"><label for="loginEmail">Email</label><input id="loginEmail" name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label for="loginPassword">Password</label><input id="loginPassword" name="password" type="password" required placeholder="••••••••"></div><button class="action">Log in</button></form><p class="status" style="margin-top:25px">Accounts use Supabase Auth.</p>`));
    $('loginForm').onsubmit=async e=>{e.preventDefault(); if(!client)return toast('Add your Supabase credentials in config.js first.'); const {error}=await client.auth.signInWithPassword({email:$('loginEmail').value,password:$('loginPassword').value}); if(error)return toast(error.message); toast('Logged in'); closePanel(); await refreshUser();};
  }
  function signupPanel(){
    openPanel(panelTitle('New account','JOIN<br>THE HUB.',`<form id="signupForm"><div class="field"><label for="displayName">Display name</label><input id="displayName" name="display_name" required placeholder="Your name"></div><div class="field"><label for="loginEmail">Email</label><input id="loginEmail" name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label for="loginPassword">Password</label><input id="loginPassword" name="password" type="password" required minlength="8" placeholder="At least 8 characters"></div><button class="action">Create account</button></form>`));
    $('signupForm').onsubmit=async e=>{e.preventDefault(); if(!client)return toast('Add your Supabase credentials in config.js first.'); const email=$('email').value,password=$('password').value,name=$('displayName').value; const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name}}}); if(error)return toast(error.message); if(data.user)toast('Account created. Check your email if confirmation is enabled.'); closePanel();};
  }
  function addPanel(){
    if(!state.user){ loginPanel(); toast('Log in first to submit a resource.'); return; }
    const subjects=state.subjects.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
    const courses=state.courses.map(c=>`<option value="${esc(c.id)}" data-subject="${esc(c.subject_id)}">${esc(c.name)}</option>`).join('');
    openPanel(panelTitle('Community','ADD<br>A RESOURCE.',`<form id="resourceForm"><div class="field"><label for="rTitle">Title</label><input id="rTitle" name="title" required maxlength="160" placeholder="AP Physics 1 Unit 1 Review"></div><div class="field"><label for="rSubject">Subject</label><select id="rSubject" name="subject_id" required><option value="">Select subject</option>${subjects}</select></div><div class="field"><label for="rCourse">AP Course</label><select id="rCourse" name="course_id" required><option value="">Select course</option>${courses}</select></div><div class="field"><label for="rYear">Year</label><select id="rYear" name="year" required>${Array.from({length:8},(_,i)=>2026-i).map(y=>`<option>${y}</option>`).join('')}</select></div><div class="field"><label for="rUnit">Unit / topic</label><input id="rUnit" name="unit" placeholder="Unit 1 — Kinematics"></div><div class="field"><label for="rType">Resource type</label><select id="rType" name="resource_type" required>${['Study Guide','Unit Guide','Review Packet','Notes','Practice Questions','Formula Sheet','Cheat Sheet','Flashcards','Worksheet','Lecture Notes','Exam Review','Video','Website','Other'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label for="rDescription">Description</label><textarea id="rDescription" name="description" required maxlength="1200" placeholder="What makes this resource useful?"></textarea></div><div class="source-toggle"><button type="button" class="active" id="fileMode">Upload file</button><button type="button" id="linkMode">Add link</button></div><div id="fileArea" class="field"><label for="rFile">File (max 25 MB)</label><input id="rFile" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"></div><div id="linkArea" class="field" style="display:none"><label for="rUrl">External URL</label><input id="rUrl" name="external_url" type="url" placeholder="https://..."></div><button class="action">Submit for review</button></form>`));
    $('rSubject').onchange=()=>{const sid=$('rSubject').value; [...$('rCourse').options].forEach(o=>{if(!o.value)return; o.hidden=String(o.dataset.subject)!==String(sid);}); $('rCourse').value='';};
    $('fileMode').onclick=()=>{state.source='file';$('fileMode').classList.add('active');$('linkMode').classList.remove('active');$('fileArea').style.display='block';$('linkArea').style.display='none';};
    $('linkMode').onclick=()=>{state.source='link';$('linkMode').classList.add('active');$('fileMode').classList.remove('active');$('fileArea').style.display='none';$('linkArea').style.display='block';};
    $('resourceForm').onsubmit=submitResource;
  }

  async function submitResource(e){
    e.preventDefault(); if(!client)return toast('Supabase is not connected.');
    const file=$('rFile')?.files?.[0], url=$('rUrl')?.value.trim();
    if(state.source==='file' && !file)return toast('Choose a file first.');
    if(state.source==='link' && !/^https?:\/\//i.test(url))return toast('Enter a valid http(s) URL.');
    if(file && file.size>25*1024*1024)return toast('That file is larger than 25 MB.');
    const course=state.courses.find(c=>String(c.id)===String($('rCourse').value)); if(!course)return toast('Choose a course.');
    let filePath=null;
    try{
      if(file){ const ext=file.name.split('.').pop().toLowerCase(); filePath=`${crypto.randomUUID()}/${slug(file.name)}.${ext}`; const up=await client.storage.from(cfg.storageBucket||'ap-resources').upload(filePath,file,{upsert:false,contentType:file.type||undefined}); if(up.error)throw up.error; }
      const row={title:$('rTitle').value.trim(),description:$('rDescription').value.trim(),subject_id:course.subject_id,course_id:course.id,year:Number($('rYear').value),unit:$('rUnit').value.trim()||null,resource_type:$('rType').value,file_path:filePath,external_url:state.source==='link'?url:null,file_name:file?.name||null,file_size:file?.size||null,mime_type:file?.type||null,submitted_by:state.user.id,status:'pending'};
      const ins=await client.from('resources').insert(row); if(ins.error)throw ins.error;
      closePanel(); toast('Submitted for review.');
    }catch(err){ console.error(err); if(filePath)await client.storage.from(cfg.storageBucket||'ap-resources').remove([filePath]); toast(err.message||'Submission failed.'); }
  }

  async function refreshUser(){ if(!client)return; const {data}=await client.auth.getUser(); state.user=data.user||null; const profileLetter=(state.user?.user_metadata?.display_name||state.user?.email||'A').slice(0,1).toUpperCase(); $('profileBtn').textContent=profileLetter; }
  function profilePanel(){ if(!state.user)return loginPanel(); openPanel(panelTitle('Your account',`HI,<br>${esc((state.user.user_metadata?.display_name||state.user.email?.split('@')[0]||'THERE').toUpperCase())}.`,`<p class="status">${esc(state.user.email||'')}</p><button class="action" id="settingsBtn">Settings</button>`)); $('settingsBtn').onclick=settingsPanel; }
  function settingsPanel(){openPanel(panelTitle('Account','SETTINGS.',`<div class="field"><label for="newName">Display name</label><input id="newName" name="display_name" value="${esc(state.user?.user_metadata?.display_name||'')}"></div><button class="action" id="saveName">Save changes</button>`));$('saveName').onclick=async()=>{if(!client)return;const {error}=await client.auth.updateUser({data:{display_name:$('newName').value.trim()}});if(error)return toast(error.message);await refreshUser();toast('Display name saved');closePanel();};}
  function savedPanel(){const list=state.resources.filter(r=>state.saved.has(String(r.id)));openPanel(panelTitle('Library','SAVED.',list.length?list.map(r=>`<div class="result"><b>${esc(r.title)}</b><span>${esc(r.course)}</span></div>`).join(''):'<p class="status">You have not saved anything yet.</p>'));}
  async function uploadsPanel(){if(!state.user)return loginPanel();if(!client)return;const {data,error}=await client.from('resources').select('*').eq('submitted_by',state.user.id).order('created_at',{ascending:false});if(error)return toast(error.message);openPanel(panelTitle('Your content','MY<br>UPLOADS.',data?.length?data.map(r=>`<div class="result"><b>${esc(r.title)}</b><span>${esc(r.status||'pending')}</span></div>`).join(''):'<p class="status">No submissions yet.</p>'));}

  function wire(){
    $('loginBtn').onclick=loginPanel;$('signupBtn').onclick=signupPanel;$('addBtn').onclick=addPanel;$('closePanel').onclick=closePanel;
    $('profileBtn').onclick=()=>$('menu').classList.toggle('open');$('logoutBtn').onclick=async()=>{if(client)await client.auth.signOut();state.user=null;$('menu').classList.remove('open');toast('Logged out');};
    document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{ $('menu').classList.remove('open'); const p=b.dataset.panel; if(p==='profile')profilePanel(); if(p==='saved')savedPanel(); if(p==='uploads')uploadsPanel(); if(p==='settings')settingsPanel(); });
    $('overlay').onclick=e=>{if(e.target===$('overlay'))closePanel();};
    $('searchInput').oninput=renderResults;['subjectFilter','courseFilter','yearFilter','typeFilter'].forEach(id=>$(id).onchange=renderResults);
    $('featureOpen').onclick=()=>document.querySelector('#search').scrollIntoView({behavior:'smooth'});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel();});
  }
  async function init(){wire();if(client){await refreshUser();client.auth.onAuthStateChange((_event,session)=>{state.user=session?.user||null;});}await loadData();}
  init();
})();
