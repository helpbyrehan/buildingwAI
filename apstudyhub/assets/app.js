(function(){
'use strict';
const CFG=window.AP_STUDY_HUB_CONFIG||{};
const hasConfig=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_KEY&&!String(CFG.SUPABASE_URL).includes('YOUR_')&&!String(CFG.SUPABASE_KEY).includes('YOUR_'));
let sb=null,user=null,profile=null;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const slugify=v=>String(v||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
const baseHref=()=>window.APSH_BASE||'./';
const path=()=>location.pathname.replace(/\\/g,'/');

const emptyData={subjects:[],courses:[],resources:[]};
const aliases={
 psych:['ap psychology','psychology','psych'],physics:['ap physics','physics','phys'],calc:['calculus','ap calculus','calculus ab','calculus bc'],
 chemistry:['chemistry','chem','ap chemistry'],bio:['biology','biol','ap biology'],cs:['computer science','ap cs','cs'],
 csa:['computer science a','ap csa','csa'],csp:['computer science principles','ap csp','csp'],stats:['statistics','stats','ap stats'],
 gov:['government','us government','ap gov'],macro:['macroeconomics','macro','ap macro'],micro:['microeconomics','micro','ap micro'],
 apush:['ap us history','apush','us history'],world:['world history','ap world','world'],euro:['european history','ap euro','euro'],
 lang:['english language','lang','ap lang'],lit:['english literature','lit','ap lit'],seminar:['ap seminar','seminar'],research:['ap research','research'],precalc:['precalculus','precalc','ap precalculus']
};
function normalizeQuery(q){return q.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function queryTerms(q){const n=normalizeQuery(q),out=[n];Object.entries(aliases).forEach(([key,vals])=>{if(vals.some(v=>v===n||v.startsWith(n)&&n.length>=3)||key===n)out.push(...vals)});return [...new Set(out.filter(Boolean))]}
function theme(){const t=localStorage.getItem('apsh-theme')||'dark';document.documentElement.dataset.theme=t;const b=$('#themeBtn');if(b)b.textContent=t==='dark'?'☼':'◐'}
function toggleTheme(){const t=(localStorage.getItem('apsh-theme')||'dark')==='dark'?'light':'dark';localStorage.setItem('apsh-theme',t);theme();toast(t==='dark'?'Dark mode enabled':'Light mode enabled')}
function toast(msg){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2600)}
async function initSupabase(){
 if(!hasConfig||!window.supabase)return;
 sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY);
 const r=await sb.auth.getUser();user=r.data.user||null;
 if(user){const p=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();profile=p.data||null}
}
async function data(){
 if(!sb)return emptyData;
 const [s,c,r]=await Promise.all([
  sb.from('subjects').select('*').order('name'),
  sb.from('courses').select('*').order('name'),
  sb.from('resources').select('*, subjects(name,slug), courses(name,slug)').eq('status','approved').order('created_at',{ascending:false})
 ]);
 if(s.error||c.error||r.error){console.warn(s.error||c.error||r.error);return {subjects:s.data||[],courses:c.data||[],resources:r.data||[]}}
 return {subjects:s.data||[],courses:c.data||[],resources:r.data||[]}
}
const courseFor=(cs,id)=>cs.find(c=>String(c.id)===String(id));
const subjectFor=(ss,id)=>ss.find(s=>String(s.id)===String(id));
function initials(name){return (String(name||'Student').trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2)||'S').toUpperCase()}
function profileName(){return profile?.display_name||user?.user_metadata?.display_name||'Student'}
function resourceCard(r,d){
 const c=r.courses||courseFor(d.courses,r.course_id),s=r.subjects||subjectFor(d.subjects,r.subject_id);
 const unit=r.unit_number?`Unit ${esc(r.unit_number)}${r.unit_name?' · '+esc(r.unit_name):''}`:'Full Course';
 return `<article class="resource-card reveal">
  <div class="resource-top"><span class="resource-type">${esc(r.resource_type||'Resource')}</span><button class="save" data-save="${esc(r.id)}" aria-label="Save resource">☆</button></div>
  <h3>${esc(r.title)}</h3><p>${esc(r.description||'No description.')}</p>
  <div class="chips"><span class="chip">${esc(c?.name||'Course')}</span><span class="chip">${esc(unit)}</span>${r.year?`<span class="chip">${esc(r.year)}</span>`:''}</div>
  <div class="resource-meta"><span>${esc(s?.name||'')}</span>${r.featured?'<span>Featured</span>':''}</div>
  <div class="resource-actions"><a class="btn btn-primary" href="${baseHref()}resource/?id=${encodeURIComponent(r.id)}">Open</a></div>
 </article>`
}
async function savedIds(){
 if(user&&sb){const r=await sb.from('saved_resources').select('resource_id').eq('user_id',user.id);if(!r.error)return (r.data||[]).map(x=>String(x.resource_id))}
 try{return JSON.parse(localStorage.getItem('apsh-saved')||'[]').map(String)}catch{return[]}
}
async function isSaved(id){return (await savedIds()).includes(String(id))}
async function toggleSave(id){
 if(!user){toast('Log in to save resources');return}
 const exists=await isSaved(id);
 if(exists){const r=await sb.from('saved_resources').delete().eq('user_id',user.id).eq('resource_id',id);if(r.error)toast(r.error.message);else toast('Removed from Saved')}
 else {const r=await sb.from('saved_resources').insert({user_id:user.id,resource_id:id});if(r.error)toast(r.error.message);else toast('Saved')}
 document.dispatchEvent(new Event('saved-updated'))
}
async function wireCards(){for(const b of $$('[data-save]')){const id=b.dataset.save;if(await isSaved(id)){b.classList.add('saved');b.textContent='★'}b.onclick=async()=>{await toggleSave(id);const on=await isSaved(id);b.classList.toggle('saved',on);b.textContent=on?'★':'☆'}}observeReveals()}
function observeReveals(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){$$('.reveal').forEach(x=>x.classList.add('in-view'));return}
 if(!('IntersectionObserver'in window)){$$('.reveal').forEach(x=>x.classList.add('in-view'));return}
 const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');o.unobserve(e.target)}}),{threshold:.08});
 $$('.reveal:not(.in-view)').forEach(x=>o.observe(x))
}
function nav(){
 const menu=$('#menuBtn'),n=$('.nav');if(menu)n&&menu.addEventListener('click',()=>{const open=n.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
 const th=$('#themeBtn');if(th)th.onclick=toggleTheme;
 const slot=$('[data-user-slot]');if(slot){
  if(user){
   const name=esc(profileName()),letter=esc(initials(profileName()));
   slot.innerHTML=`<div class="profile-wrap"><button class="profile-btn" id="profileBtn" aria-label="Open profile menu">${letter}</button><div class="profile-menu" id="profileMenu">
    <div class="who"><strong>${name}</strong><span>${esc(user.email||'')}</span></div>
    <a href="${baseHref()}profile/">Profile</a><a href="${baseHref()}saved/">Saved</a><a href="${baseHref()}profile/#uploads">My uploads</a><a href="${baseHref()}settings/">Settings</a>${profile?.role==='admin'?`<a href="${baseHref()}admin/">Admin</a>`:''}<button class="danger" id="signout">Log out</button>
   </div></div>`;
   $('#profileBtn').onclick=()=>$('#profileMenu').classList.toggle('open');
   $('#signout').onclick=async()=>{await sb.auth.signOut();location.href=baseHref()}
  }else{
   slot.innerHTML=`<div class="auth-actions"><a class="btn btn-secondary btn-small" href="${baseHref()}login/">Log in</a><a class="btn btn-primary btn-small" href="${baseHref()}signup/">Sign up</a></div>`
  }
 }
}
function wireSearch(){
 $$('[data-global-search]').forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const q=inp.value.trim();location.href=baseHref()+'browse/'+(q?'?q='+encodeURIComponent(q):'')}}))
}
async function homePage(){
 const d=await data(),courses=$('[data-courses]'),featured=$('[data-featured]');
 if(courses)courses.innerHTML=d.courses.slice(0,9).map(c=>`<a class="course-card reveal" href="${baseHref()}course/?slug=${encodeURIComponent(c.slug)}"><div class="course-icon">${esc((c.name||'AP').replace(/^AP\s*/,'').slice(0,2).toUpperCase())}</div><h3>${esc(c.name)}</h3><p>${esc(subjectFor(d.subjects,c.subject_id)?.name||'AP Course')}</p><span class="arrow">Open course →</span></a>`).join('');
 if(featured){const a=d.resources.filter(x=>x.featured).slice(0,3);featured.innerHTML=a.length?a.map(x=>resourceCard(x,d)).join(''):'<div class="empty"><h3>Resources are growing.</h3><p>Check Browse to explore the library.</p></div>';await wireCards()}
 const c=$('[data-stat-courses]'),r=$('[data-stat-resources]');if(c)c.textContent=d.courses.length;if(r)r.textContent=d.resources.length;
}
function scoreResource(r,d,terms){
 const c=courseFor(d.courses,r.course_id),s=subjectFor(d.subjects,r.subject_id),hay=normalizeQuery([r.title,r.description,r.unit_name,r.resource_type,c?.name,s?.name].join(' '));
 let score=0;for(const t of terms){if(!t)continue;if(normalizeQuery(r.title)===t)score+=100;if(normalizeQuery(c?.name||'')===t)score+=90;if(normalizeQuery(s?.name||'')===t)score+=60;if(hay.includes(t))score+=20;if(normalizeQuery(r.unit_name||'').includes(t))score+=35}
 if(r.featured)score+=5;return score
}
async function browsePage(){
 const d=await data(),search=$('#browseSearch'),subject=$('#filterSubject'),course=$('#filterCourse'),year=$('#filterYear'),type=$('#filterType'),sort=$('#filterSort'),list=$('[data-browse-list]'),count=$('#resultCount');
 const q=new URLSearchParams(location.search).get('q')||'';search.value=q;
 subject.innerHTML='<option value="">All subjects</option>'+d.subjects.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
 course.innerHTML='<option value="">All courses</option>'+d.courses.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
 year.innerHTML='<option value="">All years</option>'+[...new Set(d.resources.map(x=>x.year).filter(Boolean))].sort((a,b)=>b-a).map(x=>`<option>${esc(x)}</option>`).join('');
 type.innerHTML='<option value="">All types</option>'+[...new Set(d.resources.map(x=>x.resource_type).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join('');
 function render(){
  let a=[...d.resources],n=normalizeQuery(search.value),terms=queryTerms(search.value);
  if(n)a=a.filter(r=>scoreResource(r,d,terms)>0).sort((x,y)=>scoreResource(y,d,terms)-scoreResource(x,d,terms));
  if(subject.value)a=a.filter(r=>String(r.subject_id)===subject.value);if(course.value)a=a.filter(r=>String(r.course_id)===course.value);if(year.value)a=a.filter(r=>String(r.year)===year.value);if(type.value)a=a.filter(r=>r.resource_type===type.value);
  if(sort.value==='title')a.sort((x,y)=>x.title.localeCompare(y.title));if(sort.value==='oldest')a.sort((x,y)=>new Date(x.created_at)-new Date(y.created_at));if(sort.value==='featured'&&!n)a.sort((x,y)=>Number(y.featured)-Number(x.featured));
  count.textContent=`${a.length} result${a.length===1?'':'s'}`;
  list.innerHTML=a.length?a.map(r=>resourceCard(r,d)).join(''):`<div class="empty" style="grid-column:1/-1"><h3>Nothing found.</h3><p>Try another course, unit, or search.</p><button class="btn btn-secondary" id="clearFilters">Clear filters</button></div>`;wireCards();
  const clear=$('#clearFilters');if(clear)clear.onclick=()=>{search.value='';subject.value='';course.value='';year.value='';type.value='';render()}
 }
 [search,subject,course,year,type,sort].forEach(x=>x.addEventListener('input',render));render()
}
async function coursesPage(){
 const d=await data(),list=$('[data-course-list]');list.innerHTML=d.courses.map(c=>`<a class="course-card reveal" href="../course/?slug=${encodeURIComponent(c.slug)}"><div class="course-icon">${esc((c.name||'AP').replace(/^AP\s*/,'').slice(0,2).toUpperCase())}</div><h3>${esc(c.name)}</h3><p>${esc(subjectFor(d.subjects,c.subject_id)?.name||'AP Course')}</p><span class="arrow">Open course →</span></a>`).join('');observeReveals()
}
async function coursePage(){
 const d=await data(),slug=new URLSearchParams(location.search).get('slug'),c=d.courses.find(x=>x.slug===slug||String(x.id)===String(slug)),head=$('[data-course-title]'),desc=$('[data-course-desc]'),list=$('[data-course-resources]');
 if(!c){head.textContent='Course not found';desc.textContent='';return}head.textContent=c.name;desc.textContent=c.description||'AP resources';const a=d.resources.filter(r=>String(r.course_id)===String(c.id));list.innerHTML=a.length?a.map(r=>resourceCard(r,d)).join(''):'<div class="empty"><h3>No resources yet.</h3><p>Be the first to contribute.</p></div>';wireCards()
}
async function resourcePage(){
 const d=await data(),id=new URLSearchParams(location.search).get('id'),slug=new URLSearchParams(location.search).get('slug'),r=d.resources.find(x=>String(x.id)===String(id)||x.slug===slug);
 const title=$('[data-resource-title]');if(!r){title.textContent='Resource not found';return}
 const c=r.courses||courseFor(d.courses,r.course_id);title.textContent=r.title;$('[data-resource-description]').textContent=r.description||'';
 $('[data-resource-meta]').innerHTML=`<span class="chip">${esc(c?.name||'')}</span><span class="chip">${esc(r.unit_number?'Unit '+r.unit_number+(r.unit_name?' · '+r.unit_name:''):'Full Course')}</span>${r.year?`<span class="chip">${esc(r.year)}</span>`:''}<span class="chip">${esc(r.resource_type||'Resource')}</span>`;
 const open=$('#resourceOpen'),download=$('#resourceDownload'),viewer=$('#pdfViewer'),note=$('#resourceNote');
 if(r.external_url){open.href=r.external_url;download.classList.add('hide');viewer.classList.add('hide');note.textContent='External resource'}
 else if(r.file_path&&sb){const x=sb.storage.from(CFG.PUBLIC_BUCKET||'ap-public-resources').getPublicUrl(r.file_path);if(x.data?.publicUrl){open.href=x.data.publicUrl;download.href=x.data.publicUrl;download.download=r.file_name||'';viewer.src=x.data.publicUrl;note.textContent='PDF preview'}else note.textContent='This file could not be opened.'}
 else{open.classList.add('hide');download.classList.add('hide');viewer.classList.add('hide');note.textContent='No file is attached.'}
 const save=$('#detailSave');const sync=async()=>{const on=await isSaved(r.id);save.textContent=on?'★ Saved':'☆ Save';save.classList.toggle('saved',on)};await sync();save.onclick=async()=>{await toggleSave(r.id);sync()}
}
function setNotice(msg,type=''){const n=$('#formNotice');if(n){n.textContent=msg;n.className='notice '+type}}
async function requireAuth(){
 if(!user){location.href=baseHref()+'login/?next='+encodeURIComponent(location.pathname+location.search);return false}return true
}
function validText(v,max=180){const x=String(v||'').trim();return x.length>0&&x.length<=max&&!/[<>]/.test(x)}
function safeUrl(v){try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}}
async function addPage(){
 if(!await requireAuth())return;const d=await data(),s=$('#addSubject'),c=$('#addCourse'),u=$('#addUnit');
 s.innerHTML='<option value="">Select subject</option>'+d.subjects.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');c.innerHTML='<option value="">Select course</option>';u.innerHTML='<option value="">Full Course</option>';
 s.onchange=()=>{c.innerHTML='<option value="">Select course</option>'+d.courses.filter(x=>String(x.subject_id)===String(s.value)).map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');u.innerHTML='<option value="">Full Course</option>'};
 c.onchange=()=>{u.innerHTML='<option value="">Full Course</option>';const units=[...new Map(d.resources.filter(x=>String(x.course_id)===String(c.value)&&x.unit_number).map(x=>[x.unit_number,x.unit_name])).entries()].sort((a,b)=>a[0]-b[0]);u.innerHTML+=[...units].map(x=>`<option value="${esc(x[0])}">Unit ${esc(x[0])}${x[1]?' · '+esc(x[1]):''}</option>`).join('')};
 const form=$('#addForm'),file=$('#resourceFile'),link=$('#externalUrl'),fileBox=$('#fileBox'),linkBox=$('#linkBox');
 const sync=()=>{const mode=$('input[name="resourceMode"]:checked').value;fileBox.classList.toggle('hide',mode!=='file');linkBox.classList.toggle('hide',mode!=='link');file.required=mode==='file';link.required=mode==='link'};$$('input[name="resourceMode"]').forEach(x=>x.onchange=sync);sync();
 form.onsubmit=async e=>{e.preventDefault();if(!sb){setNotice('Supabase is not connected.','error');return}const title=$('#resourceTitle').value.trim(),desc=$('#resourceDescription').value.trim(),mode=$('input[name="resourceMode"]:checked').value,f=file.files[0];
  if(!validText(title,180)){setNotice('Enter a valid title.','error');return}if(desc.length>2000||/[<>]/.test(desc)){setNotice('Description contains invalid characters or is too long.','error');return}
  if(mode==='file'&&(!f||f.type!=='application/pdf')){setNotice('Choose a PDF.','error');return}if(f&&f.size>(CFG.MAX_UPLOAD_MB||25)*1024*1024){setNotice(`File must be ${CFG.MAX_UPLOAD_MB||25} MB or smaller.`,'error');return}
  const url=mode==='link'?safeUrl(link.value.trim()):null;if(mode==='link'&&!url){setNotice('Use a valid http(s) URL.','error');return}
  const btn=form.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Submitting…';
  try{let fp=null;if(f){fp=`pending/${user.id}/${Date.now()}-${slugify(f.name)||'resource'}.pdf`;const up=await sb.storage.from(CFG.STORAGE_BUCKET||'ap-resources').upload(fp,f,{contentType:'application/pdf',upsert:false});if(up.error)throw up.error}
   const row={title,slug:slugify(title),description:desc||null,subject_id:s.value,course_id:c.value,year:$('#addYear').value?Number($('#addYear').value):null,unit_number:u.value?Number(u.value):null,unit_name:null,resource_type:$('#resourceType').value,file_path:fp,file_name:f?.name||null,file_size:f?.size||null,mime_type:f?.type||null,external_url:url,submitted_by:user.id,status:'pending',featured:false};
   const ins=await sb.from('resources').insert(row);if(ins.error)throw ins.error;form.reset();sync();setNotice('Submitted. It will appear after review.','success');toast('Resource submitted')
  }catch(err){console.error(err);setNotice(err.message||'Submission failed.','error')}finally{btn.disabled=false;btn.textContent='Submit'}
 }
}
async function loginPage(){
 const form=$('#loginForm');if(!form)return;if(!sb){setNotice('Accounts are temporarily unavailable. Please try again later.','error');return}
 form.onsubmit=async e=>{e.preventDefault();const b=form.querySelector('button');b.disabled=true;try{const {error}=await sb.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});if(error)throw error;const next=new URLSearchParams(location.search).get('next');location.href=next||baseHref()}catch(x){setNotice(x.message||'Login failed.','error')}finally{b.disabled=false}}
 const forgot=$('#forgotBtn');if(forgot)forgot.onclick=async()=>{const email=$('#email').value.trim();if(!email){setNotice('Enter your email first.','error');return}const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+baseHref()+'settings/'});setNotice(error?error.message:'Password reset email sent. Check your inbox.',error?'error':'success')}
}
async function signupPage(){
 const form=$('#signupForm');if(!form)return;if(!sb){setNotice('Accounts are temporarily unavailable. Please try again later.','error');return}
 form.onsubmit=async e=>{e.preventDefault();const name=$('#displayName').value.trim(),email=$('#email').value.trim(),pw=$('#password').value,confirm=$('#confirmPassword').value;
  if(!/^[A-Za-z][A-Za-z .'-]{1,29}$/.test(name)){setNotice('Use 2–30 letters with spaces or simple punctuation.','error');return}
  if(pw.length<8){setNotice('Password must be at least 8 characters.','error');return}if(pw!==confirm){setNotice('Passwords do not match.','error');return}
  const b=form.querySelector('button');b.disabled=true;try{const {data,error}=await sb.auth.signUp({email,password:pw,options:{data:{display_name:name}}});if(error)throw error;
   if(data.session){await sb.from('profiles').upsert({id:data.user.id,display_name:name},{onConflict:'id'});location.href=baseHref()}
   else setNotice('Account created. Check your email to confirm your account.','success')
  }catch(x){setNotice(x.message||'Sign up failed.','error')}finally{b.disabled=false}
 }
}
async function savedPage(){
 const list=$('#savedList');if(!user){list.innerHTML='<div class="empty"><h3>Saved is personal.</h3><p>Log in to keep your resources across devices.</p><a class="btn btn-primary" href="../login/">Log in</a></div>';return}
 const ids=await savedIds();if(!ids.length){list.innerHTML='<div class="empty"><h3>Nothing saved.</h3><p>Save a resource and it will appear here.</p><a class="btn btn-primary" href="../browse/">Browse</a></div>';return}
 const d=await data(),items=d.resources.filter(r=>ids.includes(String(r.id)));list.innerHTML=items.length?items.map(r=>resourceCard(r,d)).join(''):'<div class="empty"><h3>Nothing saved.</h3></div>';wireCards()
}
async function profilePage(){
 if(!await requireAuth())return;const name=$('#profileName'),email=$('#profileEmail'),avatar=$('#profileAvatar');name.textContent=profileName();email.textContent=user.email||'';avatar.textContent=initials(profileName());
 const list=$('#myUploads');if(!list)return;const r=await sb.from('resources').select('*, courses(name), subjects(name)').eq('submitted_by',user.id).order('created_at',{ascending:false});if(r.error){list.innerHTML='<div class="notice error">Could not load uploads.</div>';return}
 const rows=r.data||[];list.innerHTML=rows.length?rows.map(x=>`<div class="setting-row"><div><strong>${esc(x.title)}</strong><span>${esc(x.courses?.name||'')} · <span class="status ${esc(x.status)}">${esc(x.status)}</span></span></div><button class="btn btn-secondary btn-small" data-delete-upload="${esc(x.id)}">Remove</button></div>`).join(''):'<div class="empty"><h3>No uploads.</h3><p>Share something useful with the community.</p></div>';
 $$('[data-delete-upload]').forEach(b=>b.onclick=async()=>{if(!confirm('Remove this upload?'))return;const row=rows.find(x=>String(x.id)===String(b.dataset.delete-upload));if(row?.file_path){await sb.storage.from(CFG.PENDING_BUCKET||'ap-resources').remove([row.file_path]);await sb.storage.from(CFG.PUBLIC_BUCKET||'ap-public-resources').remove([row.file_path])}const x=await sb.from('resources').delete().eq('id',b.dataset.delete-upload).eq('submitted_by',user.id);if(x.error)toast(x.error.message);else{toast('Upload removed');profilePage()}})
}
async function settingsPage(){
 if(!await requireAuth())return;$('#settingsName').value=profileName();$('#settingsEmail').value=user.email||'';
 $('#profileForm').onsubmit=async e=>{e.preventDefault();const n=$('#settingsName').value.trim();if(!/^[A-Za-z][A-Za-z .'-]{1,29}$/.test(n)){setNotice('Use 2–30 letters with spaces or simple punctuation.','error');return}const x=await sb.from('profiles').update({display_name:n,updated_at:new Date().toISOString()}).eq('id',user.id);if(x.error){setNotice(x.error.message,'error');return}profile={...profile,display_name:n};setNotice('Profile updated.','success');nav()}
 $('#passwordForm').onsubmit=async e=>{e.preventDefault();const p=$('#newPassword').value;if(p.length<8){setNotice('Password must be at least 8 characters.','error');return}const x=await sb.auth.updateUser({password:p});setNotice(x.error?x.error.message:'Password changed.','success')}
 $('#deleteAccount').onclick=async()=>{if(!confirm('Delete your account and your uploads? This cannot be undone.'))return;const x=await sb.rpc('delete_my_account');if(x.error){setNotice(x.error.message,'error');return}location.href=baseHref()}
}
async function adminPage(){
 const panel=$('#adminPanel');if(!user){location.href='../login/?next=../admin/';return}
 if(profile?.role!=='admin'){panel.innerHTML='<div class="empty"><h3>Admin access required.</h3></div>';return}
 const r=await sb.from('resources').select('*, courses(name), subjects(name)').order('created_at',{ascending:false});
 if(r.error){panel.innerHTML=`<div class="notice error">${esc(r.error.message)}</div>`;return}
 const rows=r.data||[];
 panel.innerHTML=`<div class="inline" style="margin-bottom:15px"><strong>${rows.filter(x=>x.status==='pending').length} pending</strong></div>
 <div style="overflow:auto"><table class="admin-table"><thead><tr><th>Resource</th><th>Course</th><th>Status</th><th>Actions</th></tr></thead><tbody>
 ${rows.map(x=>`<tr><td><strong>${esc(x.title)}</strong><br><span class="muted">${esc(x.description||'')}</span></td><td>${esc(x.courses?.name||'')}</td><td><span class="status ${esc(x.status)}">${esc(x.status)}</span></td><td><div class="inline">
 ${x.status==='pending'?`<button class="btn btn-primary btn-small" data-approve="${esc(x.id)}">Approve</button><button class="btn btn-secondary btn-small" data-reject="${esc(x.id)}">Reject</button>`:''}
 <button class="btn btn-secondary btn-small" data-delete="${esc(x.id)}">Delete</button></div></td></tr>`).join('')}
 </tbody></table></div>`;
 $$('[data-approve]').forEach(b=>b.onclick=()=>moderate(b.dataset.approve,'approved'));
 $$('[data-reject]').forEach(b=>b.onclick=()=>moderate(b.dataset.reject,'rejected'));
 $$('[data-delete]').forEach(b=>b.onclick=async()=>{
   if(!confirm('Delete this resource?'))return;
   const row=rows.find(x=>String(x.id)===String(b.dataset.delete));
   if(row?.file_path) await sb.storage.from(CFG.PENDING_BUCKET||'ap-resources').remove([row.file_path]).catch(()=>{});
   if(row?.status==='approved'&&row?.file_path) await sb.storage.from(CFG.PUBLIC_BUCKET||'ap-public-resources').remove([row.file_path]).catch(()=>{});
   const x=await sb.from('resources').delete().eq('id',b.dataset.delete);
   if(x.error)toast(x.error.message);else adminPage()
 });
 async function moderate(id,status){
   const row=rows.find(x=>String(x.id)===String(id));
   if(!row)return;
   if(status==='approved'&&row.file_path){
     const dl=await sb.storage.from(CFG.PENDING_BUCKET||'ap-resources').download(row.file_path);
     if(dl.error){toast('Could not read the pending PDF.');return}
     const up=await sb.storage.from(CFG.PUBLIC_BUCKET||'ap-public-resources').upload(row.file_path,dl.data,{contentType:row.mime_type||'application/pdf',upsert:true});
     if(up.error){toast('Could not publish the PDF.');return}
     await sb.storage.from(CFG.PENDING_BUCKET||'ap-resources').remove([row.file_path]);
   }
   const x=await sb.from('resources').update({status,updated_at:new Date().toISOString()}).eq('id',id);
   if(x.error)toast(x.error.message);else{toast(`Resource ${status}`);adminPage()}
 }
}
function navHighlight(){const current=path();$$('[data-nav]').forEach(a=>{const href=a.getAttribute('href')||'';const key=href.replace(/^(\.\.\/|\.\/)/,'').replace(/\/$/,'');if(!key)a.classList.toggle('active',current.endsWith('/')||current.split('/').length<=2);else a.classList.toggle('active',current.includes('/'+key+'/'))})}
async function init(){
 theme();await initSupabase();nav();wireSearch();navHighlight();
 try{
  if($('[data-home]'))await homePage();else if($('[data-browse]'))await browsePage();else if($('[data-courses]'))await coursesPage();else if($('[data-course-page]'))await coursePage();else if($('[data-resource-page]'))await resourcePage();else if($('[data-add]'))await addPage();else if($('[data-login]'))await loginPage();else if($('[data-signup]'))await signupPage();else if($('[data-saved]'))await savedPage();else if($('[data-profile]'))await profilePage();else if($('[data-settings]'))await settingsPage();else if($('[data-admin]'))await adminPage()
 }catch(e){console.error(e);const root=$('[data-error-root]');if(root)root.innerHTML=`<div class="notice error">Something went wrong. ${esc(e.message||'Unknown error')}</div>`}
 observeReveals()
}
window.APSH={toast,esc};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();