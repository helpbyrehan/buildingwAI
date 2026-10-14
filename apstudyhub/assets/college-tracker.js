(function () {
  'use strict';
  const C=window.CollegeTracker;
  if (!C||!document.querySelector('[data-college-tracker]')) return;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const options=(obj,selected='')=>Object.entries(obj).map(([value,label])=>`<option value="${esc(value)}"${selected===value?' selected':''}>${esc(label)}</option>`).join('');
  const uuid=()=>crypto.randomUUID();
  const now=()=>new Date().toISOString();
  const formatted=value=>value?new Date(value+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'Not set';
  const money=(value,currency)=>value===null?'Not entered':new Intl.NumberFormat(undefined,{style:'currency',currency,maximumFractionDigits:0}).format(value);
  let workspace=C.empty(),storageKey='',user=null,db=null,persistent=true,unreadableRaw=null,returnToDetail='',activeTab='colleges';
  let cloudEnabled=false,revision=0,syncing=false,syncAgain=false,syncTimer=null,syncError=false,lastSaved='';
  const formSnapshots=new WeakMap();
  function notify(message,action) {
    const box=$('#collegeNotice');box.classList.remove('hide');box.replaceChildren(document.createTextNode(message));
    if (action) {
      const b=document.createElement('button');b.type='button';b.className='btn btn-secondary btn-small';b.textContent=action.label;b.style.marginLeft='12px';b.addEventListener('click',action.run);box.append(b);
    }
  }
  function storageStatus(extra='') {
    const status=$('#collegeStorageStatus');
    status.textContent=extra||(!persistent?'Temporary session · download a backup before leaving':syncError?'Saved in this browser · account sync needs attention':cloudEnabled?'Saved in this browser and your account':user?'Saved in this browser · account sync is off':'Saved in this browser · guest workspace');
    status.parentElement.classList.toggle('is-warning',!persistent||syncError);
    $('#collegeSync').textContent=cloudEnabled?'Turn off account sync':syncError?'Retry account sync':'Enable account sync';
  }
  function readLocal() {
    try {
      const raw=localStorage.getItem(storageKey);lastSaved=raw||'';
      if (raw) {
        try {workspace=C.validate(JSON.parse(raw));}
        catch (_) {unreadableRaw=raw;notify('Your saved tracker could not be read. It has not been overwritten. Download a recovery copy, then import a valid backup.',{label:'Download recovery copy',run:()=>download(unreadableRaw,'college-tracker-recovery.json','application/json')});}
      }
    } catch (_) {persistent=false;notify('This browser is blocking storage. You can use a temporary workspace and download a backup before leaving.');}
  }
  function commit(next,{skipSync=false,recover=false}={}) {
    if (unreadableRaw&&!recover) throw new Error('Your previous saved data could not be read. Download its recovery copy and import a valid backup before editing.');
    next=C.validate(next);
    if (persistent) {
      let latest;
      try {latest=localStorage.getItem(storageKey);} catch (_) {throw new Error('Browser storage is unavailable. Your change has not been saved; keep this editor open and try again.');}
      if (latest&&latest!==lastSaved&&!recover) next=C.merge(C.validate(JSON.parse(latest)),next);
      const raw=JSON.stringify(next);
      try {localStorage.setItem(storageKey,raw);} catch (_) {throw new Error('This browser could not save the change. Download a backup, free some browser storage, and try again. Your editor is still open.');}
      lastSaved=raw;
    }
    workspace=next;if(recover)unreadableRaw=null;
    render();storageStatus();
    if(cloudEnabled&&!skipSync){clearTimeout(syncTimer);storageStatus('Saved in this browser · syncing…');syncTimer=setTimeout(writeCloud,500);}
    if (!persistent) notify('Your change is in this temporary session. Download a backup before leaving.');
  }
  function upsert(kind,row) {
    const rows=workspace[kind].slice(),index=rows.findIndex(r=>r.id===row.id);
    if(index<0)rows.push(row);else rows[index]=row;
    commit({...workspace,[kind]:rows});
  }
  function dateLabel(due) {
    if (!due) return 'No date set';
    const n=C.daysUntil(due);
    return n<0?`${Math.abs(n)} day${n===-1?'':'s'} overdue`:n===0?'Due today':n===1?'Due tomorrow':`${n} days left`;
  }
  function badge(value,positive=false) {return `<span class="college-pill${positive?' is-positive':''}">${esc(value)}</span>`;}
  function deadlineBadge(due) {return `<span class="college-pill${C.daysUntil(due)<0?' is-overdue':''}">${esc(dateLabel(due))}</span>`;}
  function empty(title,copy,action='') {return `<div class="college-empty"><span class="college-empty-mark" aria-hidden="true">✧</span><h3>${esc(title)}</h3><p>${esc(copy)}</p>${action}</div>`;}
  const collegeName=id=>workspace.colleges.find(c=>c.id===id)?.name||'All applications';
  const availableCollege=id=>!id||workspace.colleges.some(c=>c.id===id&&!c.archived);
  function collegeOptions(selected='',allLabel='All applications / shared') {
    return `<option value="">${esc(allLabel)}</option>`+workspace.colleges.filter(c=>!c.archived||c.id===selected).sort((a,b)=>a.name.localeCompare(b.name)).map(c=>`<option value="${esc(c.id)}"${c.id===selected?' selected':''}>${esc(c.name)}${c.archived?' (archived)':''}</option>`).join('');
  }
  function render() {
    renderOverview();renderColleges();renderTimeline();renderTasks();renderEssays();renderComparison();
    const selected=$('#taskCollegeFilter').value;
    $('#taskCollegeFilter').innerHTML='<option value="*">Every college</option>'+collegeOptions('','Shared / all applications only');
    if ([...$('#taskCollegeFilter').options].some(o=>o.value===selected)) $('#taskCollegeFilter').value=selected;
    else $('#taskCollegeFilter').value='*';
    // Re-render after preserving the filter when colleges change.
    renderTasks();
  }
  function renderOverview() {
    const colleges=workspace.colleges.filter(c=>!c.archived),deadlines=C.deadlineItems(workspace),overdue=deadlines.filter(d=>C.daysUntil(d.due)<0),soon=deadlines.filter(d=>{const n=C.daysUntil(d.due);return n>=0&&n<=30;});
    const submitted=colleges.filter(c=>C.SENT.has(c.status)&&c.status!=='withdrawn').length;
    $('#collegeStats').innerHTML=[['Colleges on your list',colleges.length],['Submitted applications',submitted],['Deadlines in 30 days',soon.length],['Overdue items',overdue.length]].map(([label,value])=>`<div class="college-stat"><strong>${value.toString().padStart(2,'0')}</strong><span>${label}</span></div>`).join('');
    const next=deadlines[0];
    $('#collegeNext').innerHTML=next?`<div><div class="eyebrow">${C.daysUntil(next.due)<0?'Needs your attention':'Your next move'}</div><h2>${esc(next.title)}</h2><p>${esc(next.college)} · ${esc(next.category)}</p></div><div class="college-next-date"><strong class="${C.daysUntil(next.due)<0?'is-overdue':''}">${esc(dateLabel(next.due))}</strong><span>${esc(formatted(next.due))}</span><button class="text-btn" data-open-record="${esc(next.type)}" data-record-id="${esc(next.recordId)}">Open →</button></div>`:`<div><div class="eyebrow">A little space to think</div><h2>${colleges.length?'Your next deadline starts here.':'Your future, a little more organized.'}</h2><p>${colleges.length?'Add a deadline to a college, task, or essay to see your next move.':'Start with one college. You can figure out the rest as you go.'}</p></div><span aria-hidden="true" style="font-size:34px;color:var(--faint)">✧</span>`;
    $('#exportCalendar').disabled=!deadlines.length;
  }
  function renderColleges() {
    const query=$('#collegeSearch').value.trim().toLowerCase(),status=$('#collegeStatusFilter').value,archived=$('#showArchived').checked;
    let rows=workspace.colleges.filter(c=>c.archived===archived&&(!status||c.status===status)&&(!query||[c.name,c.location,c.major].some(v=>v.toLowerCase().includes(query))));
    const sort=$('#collegeSort').value;
    rows.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='status'?C.STATUSES[a.status].localeCompare(C.STATUSES[b.status])||a.name.localeCompare(b.name):(a.deadline||'9999').localeCompare(b.deadline||'9999')||a.name.localeCompare(b.name));
    $('#collegeResultCount').textContent=`${rows.length} ${archived?'archived ':''}college${rows.length===1?'':'s'}${query||status?' match your filters':''}`;
    $('#collegeGrid').innerHTML=rows.length?rows.map(c=>{
      const p=C.progress(workspace,c.id),short=c.name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>Array.from(w)[0]).join('').toUpperCase();
      return `<article class="college-card"><div class="college-card-head"><span class="college-monogram" aria-hidden="true">${esc(short)}</span><div><h3>${esc(c.name)}</h3><p>${esc([c.location,c.major].filter(Boolean).join(' · ')||'Your next chapter')}</p></div></div><div class="college-card-tags">${badge(C.STATUSES[c.status],['accepted','enrolled'].includes(c.status))}${badge(C.ROUNDS[c.round])}${c.category!=='unsure'?badge(C.CATEGORIES[c.category]):''}</div><div class="college-card-deadline"><span>Application deadline</span><strong>${esc(formatted(c.deadline))}</strong></div>${c.deadline&&!C.SENT.has(c.status)?`<div style="margin-top:10px">${deadlineBadge(c.deadline)}</div>`:''}<div class="college-progress-meta"><span>${p.total?`${p.done} of ${p.total} tracked items complete`:'Build your checklist'}</span><span>${p.total?p.percent+'%':'—'}</span></div><div class="college-progress" aria-hidden="true"><span style="width:${p.percent}%"></span></div><div class="college-card-actions">${archived?`<button class="btn btn-secondary" data-restore-kind="colleges" data-record-id="${esc(c.id)}">Restore college</button>`:`<button class="btn btn-primary" data-open-college="${esc(c.id)}" aria-label="Open ${esc(c.name)}">Open workspace ↗</button><button class="btn btn-secondary" data-edit-college="${esc(c.id)}" aria-label="Edit ${esc(c.name)}">Edit</button>`}</div></article>`;
    }).join(''):empty(archived?'Nothing archived.':query||status?'No colleges match.':'A shortlist starts with one.',archived?'Colleges you archive will stay here until you restore them.':query||status?'Try a different search or status filter.':'Add the schools you are considering, then give every application a clear next step.',!archived&&!query&&!status?'<button class="btn btn-primary" data-add-college>Add your first college ↗</button>':'');
  }
  function renderTimeline() {
    const range=$('#deadlineRange').value;
    const rows=C.deadlineItems(workspace).filter(item=>{const n=C.daysUntil(item.due);return range==='all'||(range==='overdue'?n<0:n>=0&&n<=Number(range));});
    const groups=new Map();for(const item of rows){if(!groups.has(item.due))groups.set(item.due,[]);groups.get(item.due).push(item);}
    $('#collegeTimeline').innerHTML=rows.length?[...groups].map(([due,items])=>`<section class="college-timeline-day"><div class="college-timeline-date">${esc(formatted(due))}</div><div class="college-timeline-list">${items.map(item=>`<article class="college-timeline-item"><div><strong>${esc(item.title)}</strong><small>${esc(item.college)} · ${esc(item.category)}</small><p>${esc(dateLabel(item.due))}</p></div><button class="text-btn" data-open-record="${item.type}" data-record-id="${esc(item.recordId)}" aria-label="Open ${esc(item.title)} for ${esc(item.college)}">Open ↗</button></article>`).join('')}</div></section>`).join(''):empty('Nothing due in this view.','Dates you enter on colleges, unfinished tasks, and essays will show up here.');
  }
  function taskRows(rows,{detail=false}={}) {
    return `<div class="college-task-list">${rows.map(t=>`<div class="college-task-row${t.completed?' is-complete':''}"><label><input type="checkbox" data-toggle-task="${esc(t.id)}"${t.completed?' checked':''}${t.archived?' disabled':''}><span><strong>${esc(t.title)}</strong><small>${esc(detail?C.TASK_TYPES[t.category]:collegeName(t.collegeId)+' · '+C.TASK_TYPES[t.category])}${t.due?' · '+esc(formatted(t.due)):''}${t.due&&!t.completed?' · '+esc(dateLabel(t.due)):''}</small></span></label><div class="college-task-actions">${t.archived?`<button class="text-btn" data-restore-kind="tasks" data-record-id="${esc(t.id)}">Restore</button>`:`<button class="text-btn" data-edit-task="${esc(t.id)}" aria-label="Edit ${esc(t.title)}">Edit</button><button class="text-btn" data-archive-kind="tasks" data-record-id="${esc(t.id)}" aria-label="Archive ${esc(t.title)}">Archive</button>`}</div></div>`).join('')}</div>`;
  }
  function renderTasks() {
    const filter=$('#taskCollegeFilter').value||'*',category=$('#taskTypeFilter').value,showDone=$('#showCompleted').checked,archived=$('#showArchivedTasks').checked;
    const rows=workspace.tasks.filter(t=>t.archived===archived&&availableCollege(t.collegeId)&&(filter==='*'||t.collegeId===filter)&&(!category||t.category===category)&&(showDone||!t.completed)).sort((a,b)=>Number(a.completed)-Number(b.completed)||(a.due||'9999').localeCompare(b.due||'9999')||a.title.localeCompare(b.title));
    $('#collegeTasks').innerHTML=rows.length?taskRows(rows):empty(archived?'No archived tasks.':'A clear next step feels good.',archived?'Tasks you archive can be restored here.':'Add a task for one college or for all of your applications. You can choose the due date when you know it.');
  }
  function renderEssays() {
    const archived=$('#showArchivedEssays').checked;
    const rows=workspace.essays.filter(e=>e.archived===archived&&availableCollege(e.collegeId)).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')||a.title.localeCompare(b.title));
    $('#collegeEssays').innerHTML=rows.length?rows.map(e=>{const count=C.wordCount(e.draft),over=e.wordLimit&&count>e.wordLimit;return `<article class="college-card"><div class="eyebrow">${esc(e.collegeId?collegeName(e.collegeId):'Shared essay')}</div><h3 style="margin-top:14px">${esc(e.title)}</h3><div class="college-card-tags">${badge(C.ESSAY_STATUSES[e.status],C.isEssayDone(e))}${e.due&&!C.isEssayDone(e)?deadlineBadge(e.due):''}</div><p class="college-essay-prompt">${esc(e.prompt||'Add a prompt and start shaping your story.')}</p><div class="college-essay-meta"><span class="${over?'is-overdue':''}">${count}${e.wordLimit?' / '+e.wordLimit:''} words${over?' · over limit':''}</span><span>${e.due?esc(formatted(e.due)):'No date set'}</span></div><div class="college-card-actions">${archived?`<button class="btn btn-secondary" data-restore-kind="essays" data-record-id="${esc(e.id)}">Restore essay</button>`:`<button class="btn btn-primary" data-edit-essay="${esc(e.id)}" aria-label="Open essay ${esc(e.title)}">Open draft ↗</button><button class="btn btn-ghost" data-archive-kind="essays" data-record-id="${esc(e.id)}" aria-label="Archive essay ${esc(e.title)}">Archive</button>`}</div></article>`;}).join(''):empty(archived?'No archived essays.':'A blank page, full of possibility.',archived?'Archived essays stay available to restore.':'Add a personal statement, a college supplement, or a scholarship essay. Your drafts stay in your workspace.');
  }
  function renderComparison() {
    const rows=workspace.colleges.filter(c=>!c.archived).sort((a,b)=>a.name.localeCompare(b.name));
    $('#collegeComparison').innerHTML=rows.length?`<table class="college-table"><caption class="sr-only">User-entered annual costs and grants by college</caption><thead><tr><th scope="col">College</th><th scope="col">Application fee</th><th scope="col">Annual total cost</th><th scope="col">Annual grants / scholarships</th><th scope="col">Annual cost less grants</th></tr></thead><tbody>${rows.map(c=>`<tr><td><button class="text-btn" data-edit-college="${esc(c.id)}"><strong>${esc(c.name)}</strong></button><small>${esc(c.major||C.STATUSES[c.status])}</small></td><td>${esc(money(c.fee,c.currency))}</td><td>${esc(money(c.annualCost,c.currency))}</td><td>${esc(money(c.aid,c.currency))}</td><td><strong>${c.annualCost===null||c.aid===null?'Not enough information':esc(money(Math.max(0,c.annualCost-c.aid),c.currency))}</strong><small>${esc(c.currency)} · user-entered estimate</small></td></tr>`).join('')}</tbody></table>`:empty('A clearer picture, side by side.','Add colleges and enter their costs and aid offers to compare them here.');
  }
  function switchTab(tab,focus=false) {
    activeTab=tab;
    $$('[data-college-tab]').forEach(button=>{const selected=button.dataset.collegeTab===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected&&focus)button.focus();});
    $$('[role=tabpanel]').forEach(panel=>panel.hidden=panel.id!=='view-'+tab);
  }
  function snapshot(form) {return JSON.stringify([...new FormData(form)]);}
  function openForm(dialog,form,values) {
    form.reset();$$('.college-form-error',dialog).forEach(el=>el.textContent='');
    for(const [key,value] of Object.entries(values)) {const input=form.elements.namedItem(key);if(!input)continue;if(input.type==='checkbox')input.checked=!!value;else input.value=value??'';}
    formSnapshots.set(form,snapshot(form));dialog.showModal();
  }
  async function closeEditor(dialog,force=false) {
    const form=$('form',dialog);
    if(!force&&form&&snapshot(form)!==formSnapshots.get(form)&&!await confirmAction('Keep your changes?','You have unsaved changes in this editor. Choose “Discard changes” to leave without saving.','Discard changes'))return;
    dialog.close();if(returnToDetail){const id=returnToDetail;returnToDetail='';openDetail(id);}
  }
  function openCollege(id='') {
    const row=workspace.colleges.find(c=>c.id===id)||{round:'undecided',status:'researching',category:'unsure',currency:'USD',starter:true};
    $('#collegeEditorTitle').textContent=id?'Edit college':'Add a college';$('#starterChecklistLabel').hidden=!!id;
    openForm($('#collegeEditor'),$('#collegeForm'),{...row,id});
  }
  function openTask(id='',collegeId='') {
    const row=workspace.tasks.find(t=>t.id===id)||{collegeId,category:'other',completed:false};
    $('#taskCollege').innerHTML=collegeOptions(row.collegeId);
    $('#taskEditorTitle').textContent=id?'Edit task':'Add a task';openForm($('#taskEditor'),$('#collegeTaskForm'),{...row,id});
  }
  function openEssay(id='',collegeId='') {
    const row=workspace.essays.find(e=>e.id===id)||{collegeId,status:'idea'};
    $('#essayCollege').innerHTML=collegeOptions(row.collegeId);
    $('#essayEditorTitle').textContent=id?'Edit essay':'Add an essay';openForm($('#essayEditor'),$('#collegeEssayForm'),{...row,id});updateWordCount();
  }
  function updateWordCount() {
    const count=C.wordCount($('#essayDraft').value),limit=Number($('#essayWordLimit').value)||0;
    $('#essayWordCount').textContent=count+(limit?' / '+limit:'')+' words'+(limit&&count>limit?' · '+(count-limit)+' over limit':'');
    $('#essayWordCount').classList.toggle('is-overdue',!!limit&&count>limit);
  }
  function openDetail(id) {
    const c=workspace.colleges.find(c=>c.id===id);if(!c||c.archived)return;
    const p=C.progress(workspace,id),tasks=workspace.tasks.filter(t=>t.collegeId===id&&!t.archived),essays=workspace.essays.filter(e=>e.collegeId===id&&!e.archived);
    $('#collegeDetailContent').innerHTML=`<header class="college-dialog-head"><div><div class="eyebrow">${esc(c.location||'Your college workspace')}</div><h2 id="collegeDetailTitle">${esc(c.name)}</h2></div><button type="button" class="icon-btn" data-close-dialog aria-label="Close college workspace">×</button></header><div class="college-detail-top-actions"><button class="btn btn-primary" data-edit-college="${esc(id)}">Edit college</button>${c.portal?`<a class="btn btn-secondary" href="${esc(c.portal)}" target="_blank" rel="noopener noreferrer">Open portal ↗</a>`:''}${c.requirementsUrl?`<a class="btn btn-secondary" href="${esc(c.requirementsUrl)}" target="_blank" rel="noopener noreferrer">Official requirements ↗</a>`:''}</div><dl class="college-detail-facts"><div><dt>Program / major</dt><dd>${esc(c.major||'Not set')}</dd></div><div><dt>Application round</dt><dd>${esc(C.ROUNDS[c.round])}</dd></div><div><dt>Application deadline</dt><dd>${esc(formatted(c.deadline))}</dd></div><div><dt>Expected decision</dt><dd>${esc(formatted(c.decisionDate))}</dd></div><div><dt>Enrollment / deposit</dt><dd>${esc(formatted(c.depositDate))}</dd></div><div><dt>Shortlist category</dt><dd>${esc(C.CATEGORIES[c.category])}</dd></div></dl><div class="field"><label for="detailStatus">Application status</label><select class="select" id="detailStatus" data-college-status="${esc(id)}">${options(C.STATUSES,c.status)}</select></div><p class="college-note">Marking an application submitted only updates this tracker. Confirm that the college received every required item in its portal.</p><div class="college-detail-section"><div class="college-view-head" style="margin:0 0 16px"><div><h3>Checklist</h3><p class="college-help">${p.done} of ${p.total} tracked tasks and essays complete. Customize these to match the college’s requirements.</p></div><button class="btn btn-secondary btn-small" data-new-task-for="${esc(id)}">Add task +</button></div>${tasks.length?taskRows(tasks,{detail:true}):'<p class="college-note">No tasks yet. Add your first requirement or next step.</p>'}</div><div class="college-detail-section"><div class="college-view-head" style="margin:0 0 16px"><h3>Essays</h3><button class="btn btn-secondary btn-small" data-new-essay-for="${esc(id)}">Add essay +</button></div>${essays.length?essays.map(e=>`<button class="list-row text-btn" style="width:100%;text-align:left" data-edit-essay="${esc(e.id)}"><span><strong>${esc(e.title)}</strong><small>${esc(C.ESSAY_STATUSES[e.status])} · ${C.wordCount(e.draft)} words</small></span><span>Open ↗</span></button>`).join(''):'<p class="college-note">College-specific essays will appear here. Shared essays live in the Essays view.</p>'}</div>${c.notes?`<div class="college-detail-section"><h3>Research notes</h3><p class="college-detail-notes">${esc(c.notes)}</p></div>`:''}<footer class="college-dialog-actions"><button class="btn btn-ghost btn-small" data-archive-kind="colleges" data-record-id="${esc(id)}">Archive college</button><button class="btn btn-secondary" data-close-dialog>Done</button></footer>`;
    $('#collegeDetail').dataset.collegeId=id;
    if(!$('#collegeDetail').open)$('#collegeDetail').showModal();
  }
  function leaveDetailForEditor() {
    if($('#collegeDetail').open){returnToDetail=$('#collegeDetail').dataset.collegeId;$('#collegeDetail').close();}
  }
  function confirmAction(title,copy,accept='Continue') {
    const dialog=$('#collegeConfirm');$('#collegeConfirmTitle').textContent=title;$('#collegeConfirmText').textContent=copy;$('#collegeConfirmAccept').textContent=accept;
    return new Promise(resolve=>{
      function finish(result){dialog.close();$('#collegeConfirmAccept').onclick=null;$('#collegeConfirmCancel').onclick=null;dialog.removeEventListener('cancel',cancel);resolve(result);}
      function cancel(e){e.preventDefault();finish(false);}
      $('#collegeConfirmAccept').onclick=()=>finish(true);$('#collegeConfirmCancel').onclick=()=>finish(false);dialog.addEventListener('cancel',cancel);dialog.showModal();$('#collegeConfirmCancel').focus();
    });
  }
  function download(content,name,type) {
    const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function archive(kind,id,archived) {
    const row=workspace[kind].find(r=>r.id===id);if(!row)return;
    upsert(kind,{...row,archived,updatedAt:now()});
    if($('#collegeDetail').open){if(kind==='colleges')$('#collegeDetail').close();else{openDetail($('#collegeDetail').dataset.collegeId);$(kind==='tasks'?'[data-new-task-for]':'[data-new-essay-for]',$('#collegeDetail'))?.focus({preventScroll:true});}}
    if(!archived)return notify('Restored to your workspace.');
    notify(kind==='colleges'?'College archived. Its tasks and essays are kept; restore it from the Archived view.':'Item archived. Use the Archived filter in its view to restore it.',{label:'Undo',run:()=>archive(kind,id,false)});
  }
  function formValues(form) {return Object.fromEntries(new FormData(form));}
  function wireForms() {
    $('#collegeForm').addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget,v=formValues(form),editing=!!v.id;
      try {
        const existing=workspace.colleges.find(c=>c.id===v.id),record=C.college({...existing,...v,id:v.id||uuid(),updatedAt:now()});
        let next={...workspace,colleges:editing?workspace.colleges.map(c=>c.id===record.id?record:c):[...workspace.colleges,record]};
        if(!editing&&v.starter==='on') {
          const checklist=[['Verify deadlines and program requirements','application'],['Plan personal statement and required supplements','essay'],['Request school report and transcripts','transcript'],['Check recommendations and follow up with supporters','recommendation'],['Confirm testing and score-reporting policy','testing'],['Review financial aid and scholarship requirements','aid'],['Prepare activities and achievements list','application'],['Review application and fee / waiver before submitting','application']];
          next={...next,tasks:[...next.tasks,...checklist.map(([title,category])=>C.task({id:uuid(),collegeId:record.id,title,category,updatedAt:now()}))]};
        }
        commit(next);await closeEditor($('#collegeEditor'),true);notify(editing?'College updated.':v.starter==='on'?'College added. Your checklist is ready to customize.':'College added. Add tasks and essays whenever you are ready.');
      }catch(error){$('#collegeFormError').textContent=error.message;}
    });
    $('#collegeTaskForm').addEventListener('submit',async event=>{
      event.preventDefault();const v=formValues(event.currentTarget);
      try {upsert('tasks',C.task({...workspace.tasks.find(t=>t.id===v.id),...v,id:v.id||uuid(),completed:v.completed==='on',updatedAt:now()}));await closeEditor($('#taskEditor'),true);notify('Task saved.');}catch(error){$('#taskFormError').textContent=error.message;}
    });
    $('#collegeEssayForm').addEventListener('submit',async event=>{
      event.preventDefault();const v=formValues(event.currentTarget);
      try {upsert('essays',C.essay({...workspace.essays.find(e=>e.id===v.id),...v,id:v.id||uuid(),updatedAt:now()}));await closeEditor($('#essayEditor'),true);notify('Essay saved.');}catch(error){$('#essayFormError').textContent=error.message;}
    });
    for(const dialog of $$('#collegeEditor,#taskEditor,#essayEditor'))dialog.addEventListener('cancel',e=>{e.preventDefault();closeEditor(dialog);});
    $('#essayDraft').addEventListener('input',updateWordCount);$('#essayWordLimit').addEventListener('input',updateWordCount);
  }
  function wireEvents() {
    $('#addCollege').onclick=()=>openCollege();$('#addTask').onclick=()=>openTask();$('#addEssay').onclick=()=>openEssay();
    document.addEventListener('click',async event=>{
      const b=event.target.closest('button');if(!b)return;
      try {
        if(b.matches('[data-close-dialog]')) {const d=b.closest('dialog');if(d.id==='collegeDetail')d.close();else await closeEditor(d);}
        else if(b.matches('[data-add-college]'))openCollege();
        else if(b.dataset.openCollege)openDetail(b.dataset.openCollege);
        else if(b.dataset.editCollege){leaveDetailForEditor();openCollege(b.dataset.editCollege);}
        else if(b.dataset.editTask){leaveDetailForEditor();openTask(b.dataset.editTask);}
        else if(b.dataset.editEssay){leaveDetailForEditor();openEssay(b.dataset.editEssay);}
        else if(b.dataset.newTaskFor){leaveDetailForEditor();openTask('',b.dataset.newTaskFor);}
        else if(b.dataset.newEssayFor){leaveDetailForEditor();openEssay('',b.dataset.newEssayFor);}
        else if(b.dataset.archiveKind)archive(b.dataset.archiveKind,b.dataset.recordId,true);
        else if(b.dataset.restoreKind)archive(b.dataset.restoreKind,b.dataset.recordId,false);
        else if(b.dataset.openRecord){if(b.dataset.openRecord==='college')openDetail(b.dataset.recordId);else if(b.dataset.openRecord==='task')openTask(b.dataset.recordId);else openEssay(b.dataset.recordId);}
      }catch(error){notify(error.message);}
    });
    document.addEventListener('change',event=>{
      const el=event.target;
      try {
        if(el.dataset.toggleTask){const row=workspace.tasks.find(t=>t.id===el.dataset.toggleTask);upsert('tasks',{...row,completed:el.checked,updatedAt:now()});if($('#collegeDetail').open)openDetail($('#collegeDetail').dataset.collegeId);const focusRoot=$('dialog[open]')||$('#collegeTasks');$('[data-toggle-task="'+row.id+'"]',focusRoot)?.focus({preventScroll:true});}
        if(el.dataset.collegeStatus){const row=workspace.colleges.find(c=>c.id===el.dataset.collegeStatus);upsert('colleges',{...row,status:el.value,updatedAt:now()});openDetail(row.id);$('#detailStatus').focus({preventScroll:true});}
      }catch(error){notify(error.message);render();}
    });
    $$('[data-college-tab]').forEach(button=>button.onclick=()=>switchTab(button.dataset.collegeTab));
    $('.college-tablist').addEventListener('keydown',event=>{
      const tabs=$$('[data-college-tab]'),index=tabs.indexOf(document.activeElement);if(index<0)return;
      let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
      event.preventDefault();switchTab(tabs[next].dataset.collegeTab,true);
    });
    $('#collegeSearch').oninput=renderColleges;['collegeStatusFilter','collegeSort','showArchived'].forEach(id=>$('#'+id).onchange=renderColleges);
    $('#deadlineRange').onchange=renderTimeline;['taskCollegeFilter','taskTypeFilter','showCompleted','showArchivedTasks'].forEach(id=>$('#'+id).onchange=renderTasks);$('#showArchivedEssays').onchange=renderEssays;
    $('#exportCalendar').onclick=()=>download(C.calendar(workspace),'college-deadlines-'+C.today()+'.ics','text/calendar;charset=utf-8');
    $('#exportBackup').onclick=()=>download(JSON.stringify(workspace),'college-tracker-'+C.today()+'.json','application/json');
    $('#importBackup').onclick=()=>$('#backupFile').click();
    $('#backupFile').onchange=async event=>{
      const file=event.target.files[0];if(!file)return;
      try {
        if(file.size>C.MAX_BYTES)throw new Error('Choose a backup smaller than 2 MB.');
        const incoming=C.validate(JSON.parse(await file.text()));
        if(!await confirmAction('Merge this backup?',`${incoming.colleges.length} colleges, ${incoming.tasks.length} tasks, and ${incoming.essays.length} essays. Existing records are kept; matching IDs use the newer saved version. ${cloudEnabled?'Account sync is on, so the merged workspace will also be uploaded to your account.':'The result will be saved in this browser.'}${unreadableRaw?' Download your recovery copy first; this will replace the unreadable browser data.':''}`,'Merge backup'))return;
        commit(C.merge(workspace,incoming),{recover:true});notify('Backup merged. Your workspace is up to date.');
      }catch(error){notify(error instanceof SyntaxError?'This file is not valid JSON. Choose a college tracker backup.':error.message);}
      finally{event.target.value='';}
    };
    $('#collegeSync').onclick=connectCloud;
    window.addEventListener('storage',event=>{
      if(event.key!==storageKey||!event.newValue||$$('dialog[open]').length)return;
      try{workspace=C.validate(JSON.parse(event.newValue));lastSaved=event.newValue;render();storageStatus();}catch(_){notify('A change in another tab could not be read. Your current view is unchanged.');}
    });
    window.addEventListener('beforeunload',event=>{
      if($$('#collegeEditor[open] form,#taskEditor[open] form,#essayEditor[open] form').some(form=>snapshot(form)!==formSnapshots.get(form))){event.preventDefault();event.returnValue='';}
    });
    // Recalculate date-based urgency when returning the next morning.
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  }
  async function writeCloud() {
    if(!cloudEnabled||!user||!db)return;
    if(syncing){syncAgain=true;return;}
    syncing=true;const snapshot=JSON.parse(JSON.stringify(workspace));
    try {
      revision=await C.saveRemote(db,user.id,snapshot,revision);syncError=false;
      try{localStorage.setItem(storageKey+':sync','true');}catch(_){}
      storageStatus();
      if(JSON.stringify(snapshot)!==JSON.stringify(workspace))syncAgain=true;
    }catch(error){
      cloudEnabled=false;syncError=true;
      notify(error.code==='42P01'||error.code==='PGRST205'?'Account sync is not available yet. Your tracker is saved in this browser; the site owner needs to install the college tracker database setup.':error.message?.startsWith('Another device')?error.message:'Account sync could not save. Your browser copy is safe. Check your connection, then retry account sync.');
      storageStatus();
    }finally{syncing=false;if(syncAgain){syncAgain=false;if(cloudEnabled)writeCloud();}}
  }
  async function connectCloud({automatic=false}={}) {
    if(cloudEnabled&&!automatic){
      cloudEnabled=false;clearTimeout(syncTimer);try{localStorage.removeItem(storageKey+':sync');}catch(_){}
      storageStatus();notify('Account sync is off. Your browser copy and previous account copy are kept.');return;
    }
    if(!user||!db){notify('Log in to use private account sync. Your guest tracker stays separate; download a backup if you want to import it after logging in.',{label:'Log in',run:()=>{location.href=(window.APSH_BASE||'../')+'login/?next='+encodeURIComponent(location.pathname);}});return;}
    if(!automatic&&!await confirmAction('Enable private account sync?','This uploads this account’s browser tracker, including essays and notes, to your AP Study Hub account. It merges with your saved account copy and syncs future changes. You can turn syncing off here at any time.','Enable sync'))return;
    const button=$('#collegeSync');button.disabled=true;storageStatus('Saved in this browser · connecting to your account…');
    try {
      const result=await db.from('college_application_workspaces').select('payload,revision').eq('user_id',user.id).maybeSingle();
      if(result.error)throw result.error;
      const merged=result.data?C.merge(workspace,result.data.payload):workspace;
      revision=result.data?.revision||0;commit(merged,{skipSync:true});cloudEnabled=true;syncError=false;await writeCloud();
    }catch(error){cloudEnabled=false;syncError=true;storageStatus();notify(error.code==='42P01'||error.code==='PGRST205'?'Account sync needs the college tracker database setup. Everything here still saves in this browser.':'Account sync could not connect or merge. Your browser copy is unchanged. Download a backup and try again.');}
    finally{button.disabled=false;}
  }
  async function init() {
    $('#collegeRound').innerHTML=options(C.ROUNDS);$('#collegeStage').innerHTML=options(C.STATUSES);$('#collegeCategory').innerHTML=options(C.CATEGORIES);$('#applicationTaskCategory').innerHTML=options(C.TASK_TYPES);$('#essayStage').innerHTML=options(C.ESSAY_STATUSES);$('#collegeStatusFilter').innerHTML+=options(C.STATUSES);$('#taskTypeFilter').innerHTML+=options(C.TASK_TYPES);
    const runtime=window.AP_STUDY_HUB_RUNTIME||{};
    db=runtime.supabaseClient||null;
    if(runtime.userPromise)user=await runtime.userPromise;
    storageKey='apsh-college-tracker:v1:'+(user?.id||'guest');
    readLocal();render();wireForms();wireEvents();storageStatus();$('#collegeSync').disabled=false;
    if(db)db.auth.onAuthStateChange((_event,session)=>{if((session?.user?.id||null)!==(user?.id||null))location.reload();});
    let reconnect=false;try{reconnect=localStorage.getItem(storageKey+':sync')==='true';}catch(_){}
    if(reconnect&&user&&!unreadableRaw)await connectCloud({automatic:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().catch(()=>notify('The workspace could not open. Reload the page to try again.')));
  else init().catch(()=>notify('The workspace could not open. Reload the page to try again.'));
})();
