(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CollegeTracker = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const STATUSES = {researching:'Researching',preparing:'Preparing',submitted:'Submitted',deferred:'Deferred',waitlisted:'Waitlisted',accepted:'Accepted',rejected:'Not admitted',enrolled:'Enrolled',withdrawn:'Withdrawn'};
  const ROUNDS = {undecided:'Not decided',ea:'Early action',rea:'Restrictive early action',ed1:'Early decision I',ed2:'Early decision II',rd:'Regular decision',rolling:'Rolling',other:'Other'};
  const CATEGORIES = {unsure:'Not classified',reach:'Reach',target:'Target',likely:'Likely'};
  const TASK_TYPES = {application:'Application',essay:'Writing',recommendation:'Recommendation',transcript:'Transcript / school report',testing:'Testing',aid:'Financial aid',scholarship:'Scholarship',interview:'Interview / visit',enrollment:'Enrollment',other:'Other'};
  const ESSAY_STATUSES = {idea:'Not started',drafting:'Drafting',review:'In review',ready:'Ready',submitted:'Submitted'};
  const CLOSED = new Set(['rejected','withdrawn','enrolled']);
  const SENT = new Set(['submitted','deferred','waitlisted','accepted','rejected','enrolled','withdrawn']);
  const MAX_BYTES = 2000000;
  const empty = () => ({version:1,colleges:[],tasks:[],essays:[]});
  const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
  function text(value, max, label, required=false) {
    if (value == null) value='';
    if (typeof value !== 'string' || value.length>max) throw new Error(label+' is too long or invalid.');
    value=value.replace(/\r\n?/g,'\n').trim();
    if (required && !value) throw new Error(label+' is required.');
    return value;
  }
  function id(value) {
    if (typeof value!=='string'||!/^[-_a-zA-Z0-9]{1,80}$/.test(value)) throw new Error('Invalid record ID.');
    return value;
  }
  function date(value) {
    if (!value) return '';
    if (typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(value)) throw new Error('Use a valid date between 2000 and 2099.');
    const d=new Date(value+'T00:00:00Z');
    if (!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==value) throw new Error('Use a valid calendar date.');
    return value;
  }
  function timestamp(value) {
    if (typeof value!=='string'||!/^20\d\d-/.test(value)||!Number.isFinite(Date.parse(value))) throw new Error('Invalid saved timestamp.');
    return new Date(value).toISOString();
  }
  function choice(value, options, fallback) {
    value=value||fallback;
    if (!Object.hasOwn(options,value)) throw new Error('An option in this record is invalid.');
    return value;
  }
  function amount(value,label) {
    if (value===''||value==null) return null;
    const n=Number(value);
    if (!Number.isFinite(n)||n<0||n>100000000) throw new Error(label+' must be a nonnegative amount.');
    return Math.round(n*100)/100;
  }
  function safeUrl(value) {
    value=text(value,2000,'Website');
    if (!value) return '';
    let url;
    try {url=new URL(value);} catch (_) {throw new Error('Website links must start with https:// or http://.');}
    if (!['https:','http:'].includes(url.protocol)||url.username||url.password) throw new Error('Use a website link without passwords or sign-in tokens.');
    return url.href;
  }
  function common(row) {
    if (!isRecord(row)) throw new Error('Invalid tracker record.');
    return {id:id(row.id),updatedAt:timestamp(row.updatedAt),archived:row.archived===true};
  }
  function college(row) {
    const base=common(row);
    const currency=text(row.currency||'USD',3,'Currency').toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Use a three-letter currency code, such as USD.');
    return {...base,name:text(row.name,120,'College name',true),location:text(row.location,160,'Location'),major:text(row.major,160,'Major'),round:choice(row.round,ROUNDS,'undecided'),status:choice(row.status,STATUSES,'researching'),category:choice(row.category,CATEGORIES,'unsure'),deadline:date(row.deadline),decisionDate:date(row.decisionDate),depositDate:date(row.depositDate),portal:safeUrl(row.portal),requirementsUrl:safeUrl(row.requirementsUrl),notes:text(row.notes,12000,'Research notes'),currency,fee:amount(row.fee,'Application fee'),annualCost:amount(row.annualCost,'Annual cost'),aid:amount(row.aid,'Annual grants / scholarships')};
  }
  function task(row) {
    const base=common(row);
    return {...base,collegeId:row.collegeId?id(row.collegeId):'',title:text(row.title,180,'Task title',true),category:choice(row.category,TASK_TYPES,'other'),due:date(row.due),completed:row.completed===true,notes:text(row.notes,5000,'Task notes')};
  }
  function essay(row) {
    const base=common(row),limit=row.wordLimit===''||row.wordLimit==null?null:Number(row.wordLimit);
    if (limit!==null&&(!Number.isInteger(limit)||limit<1||limit>20000)) throw new Error('Word limit must be a whole number from 1 to 20,000.');
    return {...base,collegeId:row.collegeId?id(row.collegeId):'',title:text(row.title,180,'Essay title',true),prompt:text(row.prompt,12000,'Essay prompt'),draft:text(row.draft,100000,'Essay draft'),wordLimit:limit,due:date(row.due),status:choice(row.status,ESSAY_STATUSES,'idea')};
  }
  function validate(value) {
    if (!isRecord(value)||value.version!==1) throw new Error('Choose an AP Study Hub college tracker backup (version 1).');
    const result=empty();
    for (const [key,max,normalize] of [['colleges',300,college],['tasks',6000,task],['essays',1000,essay]]) {
      if (!Array.isArray(value[key])||value[key].length>max) throw new Error('This backup contains too many '+key+'.');
      result[key]=value[key].map(normalize);
      if (new Set(result[key].map(r=>r.id)).size!==result[key].length) throw new Error('Duplicate '+key+' IDs in this backup.');
    }
    const ids=new Set(result.colleges.map(c=>c.id));
    for (const row of [...result.tasks,...result.essays]) if (row.collegeId&&!ids.has(row.collegeId)) throw new Error('A task or essay refers to a college missing from this backup.');
    if (new TextEncoder().encode(JSON.stringify(result)).length>MAX_BYTES) throw new Error('Tracker limit reached (2 MB). Export a backup and shorten older essay drafts.');
    return result;
  }
  function merge(local,incoming) {
    local=validate(local);incoming=validate(incoming);
    const result=empty();
    for (const key of ['colleges','tasks','essays']) {
      const rows=new Map(local[key].map(row=>[row.id,row]));
      incoming[key].forEach(row=>{const previous=rows.get(row.id);if(!previous||row.updatedAt>previous.updatedAt)rows.set(row.id,row);});
      result[key]=[...rows.values()];
    }
    return validate(result);
  }
  function today(now=new Date()) {
    return now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  }
  function daysUntil(value,from=today()) {
    return Math.round((Date.parse(date(value)+'T00:00:00Z')-Date.parse(date(from)+'T00:00:00Z'))/86400000);
  }
  function wordCount(value) { return String(value||'').trim().match(/\S+/gu)?.length||0; }
  function isEssayDone(row) { return ['ready','submitted'].includes(row.status); }
  function progress(workspace,collegeId) {
    const tasks=workspace.tasks.filter(t=>!t.archived&&t.collegeId===collegeId);
    const essays=workspace.essays.filter(e=>!e.archived&&e.collegeId===collegeId);
    const total=tasks.length+essays.length,done=tasks.filter(t=>t.completed).length+essays.filter(isEssayDone).length;
    return {total,done,percent:total?Math.round(done/total*100):0};
  }
  function deadlineItems(workspace) {
    const colleges=new Map(workspace.colleges.map(c=>[c.id,c]));
    const items=[];
    const active=c=>c&&!c.archived&&!CLOSED.has(c.status);
    for (const c of workspace.colleges) {
      if (!active(c)) continue;
      if (c.deadline&&!SENT.has(c.status)) items.push({id:'application-'+c.id,recordId:c.id,type:'college',category:'Application',collegeId:c.id,college:c.name,title:'Submit application',due:c.deadline});
      if (c.decisionDate&&['submitted','deferred','waitlisted'].includes(c.status)) items.push({id:'decision-'+c.id,recordId:c.id,type:'college',category:'Decision',collegeId:c.id,college:c.name,title:'Expected decision',due:c.decisionDate});
      if (c.depositDate&&c.status==='accepted') items.push({id:'enrollment-'+c.id,recordId:c.id,type:'college',category:'Enrollment',collegeId:c.id,college:c.name,title:'Enrollment / deposit',due:c.depositDate});
    }
    for (const task of workspace.tasks) {
      const c=colleges.get(task.collegeId);
      if (task.archived||task.completed||!task.due||(task.collegeId&&!active(c))) continue;
      items.push({id:'task-'+task.id,recordId:task.id,type:'task',category:TASK_TYPES[task.category],collegeId:task.collegeId,college:c?.name||'All applications',title:task.title,due:task.due});
    }
    for (const essay of workspace.essays) {
      const c=colleges.get(essay.collegeId);
      if (essay.archived||isEssayDone(essay)||!essay.due||(essay.collegeId&&!active(c))) continue;
      items.push({id:'essay-'+essay.id,recordId:essay.id,type:'essay',category:'Writing',collegeId:essay.collegeId,college:c?.name||'Shared essay',title:essay.title,due:essay.due});
    }
    return items.sort((a,b)=>a.due.localeCompare(b.due)||a.college.localeCompare(b.college)||a.id.localeCompare(b.id));
  }
  const icsEscape=value=>String(value).replace(/\\/g,'\\\\').replace(/\r\n?|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
  function foldLine(line) {
    const result=[];let part='',size=0;
    for (const char of line) {
      const bytes=new TextEncoder().encode(char).length;
      if (size+bytes>74) {result.push(part);part=' ';size=1;}
      part+=char;size+=bytes;
    }
    result.push(part);return result.join('\r\n');
  }
  function calendar(workspace,now=new Date()) {
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AP Study Hub//College Tracker//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:College application deadlines'];
    const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    for (const item of deadlineItems(workspace)) {
      const next=new Date(item.due+'T00:00:00Z');next.setUTCDate(next.getUTCDate()+1);
      lines.push('BEGIN:VEVENT','UID:'+item.id+'@apstudyhub','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+item.due.replace(/-/g,''),'DTEND;VALUE=DATE:'+next.toISOString().slice(0,10).replace(/-/g,''),'SUMMARY:'+icsEscape(item.college+' — '+item.title),'DESCRIPTION:'+icsEscape('Date-only reminder entered in AP Study Hub. Verify the exact deadline time and time zone in the official college portal.'),'TRANSP:TRANSPARENT');
      for (const days of [7,1]) lines.push('BEGIN:VALARM','TRIGGER:-P'+days+'D','ACTION:DISPLAY','DESCRIPTION:'+icsEscape(item.college+' — '+item.title),'END:VALARM');
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.map(foldLine).join('\r\n')+'\r\n';
  }
  async function saveRemote(client,userId,payload,revision) {
    if (!userId) throw new Error('Log in before syncing your tracker.');
    if (!Number.isInteger(revision)||revision<0||revision>=2147483647) throw new Error('Invalid account revision.');
    const row={payload:validate(payload),revision:revision+1,updated_at:new Date().toISOString()};
    const result=revision===0
      ? await client.from('college_application_workspaces').insert({...row,user_id:userId}).select('revision').single()
      : await client.from('college_application_workspaces').update(row).eq('user_id',userId).eq('revision',revision).select('revision').maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new Error('Another device changed your tracker. Reconnect account sync to merge those changes before saving again.');
    if (result.data.revision!==revision+1) throw new Error('Account sync returned an unexpected revision.');
    return result.data.revision;
  }
  return {STATUSES,ROUNDS,CATEGORIES,TASK_TYPES,ESSAY_STATUSES,CLOSED,SENT,MAX_BYTES,empty,college,task,essay,validate,merge,today,daysUntil,wordCount,isEssayDone,progress,deadlineItems,calendar,safeUrl,saveRemote};
});
