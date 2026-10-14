const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/college-core.js');
const updatedAt='2026-10-15T10:00:00.000Z';
const college=(overrides={})=>C.college({id:'c1',name:'Example University',updatedAt,...overrides});
const task=(overrides={})=>C.task({id:'t1',title:'Request transcript',collegeId:'c1',due:'2026-11-01',updatedAt,...overrides});
const essay=(overrides={})=>C.essay({id:'e1',title:'My essay',collegeId:'c1',due:'2026-10-30',updatedAt,...overrides});
const workspace=(overrides={})=>({version:1,colleges:[college()],tasks:[],essays:[],...overrides});

test('strict date parsing rejects nonexistent dates and preserves leap days',()=>{
  assert.equal(college({deadline:'2028-02-29'}).deadline,'2028-02-29');
  for(const deadline of ['2027-02-29','2026-04-31','2026-1-01','2100-01-01','not a date'])assert.throws(()=>college({deadline}),/date/);
});
test('day countdown is date-only and unaffected by spring or autumn DST transitions',()=>{
  assert.equal(C.daysUntil('2026-03-09','2026-03-07'),2);
  assert.equal(C.daysUntil('2026-11-02','2026-10-31'),2);
  assert.equal(C.daysUntil('2026-10-14','2026-10-15'),-1);
  assert.equal(C.daysUntil('2026-10-15','2026-10-15'),0);
});
test('unknown costs remain unknown, zero is valid, and currencies are explicit',()=>{
  const c=college({annualCost:'',aid:0,fee:0,currency:'gbp'});
  assert.equal(c.annualCost,null);assert.equal(c.aid,0);assert.equal(c.fee,0);assert.equal(c.currency,'GBP');
  for(const annualCost of [-1,'NaN',Infinity])assert.throws(()=>college({annualCost}));
  assert.throws(()=>college({currency:'$'}));
});
test('URLs cannot execute scripts or carry URL username/password credentials',()=>{
  for(const portal of ['javascript:alert(1)','data:text/html,test','https://user:secret@example.com','ftp://example.com'])assert.throws(()=>college({portal}));
  assert.equal(college({portal:'https://example.edu/admissions'}).portal,'https://example.edu/admissions');
});
test('backup validation rejects missing parents, duplicate IDs, malformed shapes and unsafe options',()=>{
  assert.throws(()=>C.validate(workspace({tasks:[task({collegeId:'missing'})]})),/missing/);
  assert.throws(()=>C.validate(workspace({colleges:[college(),college()]})),/Duplicate/);
  assert.throws(()=>C.validate({version:2,colleges:[],tasks:[],essays:[]}));
  assert.throws(()=>C.validate(workspace({tasks:{}})));
  assert.throws(()=>college({status:'__proto__'}));
  assert.throws(()=>C.validate(workspace({essays:[essay({wordLimit:0})]})));
});
test('user text is preserved as text, while IDs and field lengths are bounded',()=>{
  assert.equal(college({name:'<img src=x onerror=alert(1)>'}).name,'<img src=x onerror=alert(1)>');
  assert.throws(()=>college({id:'" onclick="attack'}));
  assert.throws(()=>college({name:'x'.repeat(121)}));
});
test('merge keeps both devices records and uses newer updates including archives',()=>{
  const a=workspace({tasks:[task()],essays:[essay()]});
  const b=workspace({colleges:[college({archived:true,updatedAt:'2026-10-16T10:00:00Z'}),college({id:'c2',name:'Second college'})],tasks:[task({title:'Older title',updatedAt:'2026-10-14T10:00:00Z'})]});
  const merged=C.merge(a,b);
  assert.equal(merged.colleges.length,2);assert.equal(merged.colleges[0].archived,true);assert.equal(merged.tasks[0].title,'Request transcript');assert.equal(merged.essays.length,1);
  assert.deepEqual(C.merge(merged,b),merged);
});
test('importing a backup twice is idempotent and does not mutate inputs',()=>{
  const a=workspace({tasks:[task()]});const before=JSON.stringify(a);
  assert.deepEqual(C.merge(C.merge(C.empty(),a),a),a);assert.equal(JSON.stringify(a),before);
});
test('submitted applications stop showing application deadlines but retain open requirements',()=>{
  const w=workspace({colleges:[college({status:'submitted',deadline:'2026-10-01',decisionDate:'2026-12-01'})],tasks:[task()]});
  const items=C.deadlineItems(w);
  assert.equal(items.some(x=>x.category==='Application'),false);assert.equal(items.some(x=>x.category==='Decision'),true);assert.equal(items.some(x=>x.type==='task'),true);
});
test('accepted colleges show enrollment dates, while closed or archived colleges stop reminders',()=>{
  assert.equal(C.deadlineItems(workspace({colleges:[college({status:'accepted',decisionDate:'2026-10-01',depositDate:'2027-05-01'})]}))[0].category,'Enrollment');
  for(const status of ['rejected','withdrawn','enrolled'])assert.equal(C.deadlineItems(workspace({colleges:[college({status,deadline:'2026-10-01'})],tasks:[task()],essays:[essay()]})).length,0);
  assert.equal(C.deadlineItems(workspace({colleges:[college({archived:true})],tasks:[task()]})).length,0);
});
test('shared tasks and essays still appear without a college and sort by date',()=>{
  const w=workspace({colleges:[],tasks:[task({collegeId:''})],essays:[essay({collegeId:''})]});
  assert.deepEqual(C.deadlineItems(w).map(x=>x.type),['essay','task']);
});
test('finished, ready, submitted, archived, and undated items do not create overdue reminders',()=>{
  const w=workspace({tasks:[task({completed:true}),task({id:'t2',archived:true}),task({id:'t3',due:''})],essays:[essay({status:'ready'}),essay({id:'e2',status:'submitted'}),essay({id:'e3',archived:true})]});
  assert.equal(C.deadlineItems(w).length,0);
});
test('progress counts only active items for that college; no items is not 100%',()=>{
  assert.deepEqual(C.progress(workspace(),'c1'),{total:0,done:0,percent:0});
  const w=workspace({tasks:[task({completed:true}),task({id:'t2'}),task({id:'t3',archived:true}),task({id:'t4',collegeId:''})],essays:[essay({status:'ready'}),essay({id:'e2',status:'drafting'})]});
  assert.deepEqual(C.progress(w,'c1'),{total:4,done:2,percent:50});
});
test('essay word counts allow incomplete and over-limit drafts without losing text',()=>{
  assert.equal(C.wordCount('  One\n two\tthree!  '),3);assert.equal(C.wordCount('   '),0);
  const e=essay({draft:'My long draft',wordLimit:2});assert.equal(e.draft,'My long draft');assert.equal(C.wordCount(e.draft),3);
});
test('calendar export uses all-day exclusive end dates across years and includes reminder requests',()=>{
  const w=workspace({colleges:[college({deadline:'2026-12-31'})]});const ics=C.calendar(w,new Date(updatedAt));
  assert.match(ics,/DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);assert.match(ics,/TRIGGER:-P7D/);assert.match(ics,/TRIGGER:-P1D/);assert.match(ics,/UID:application-c1@apstudyhub/);
});
test('calendar escaping prevents extra events; UTF-8 lines fold without broken characters',()=>{
  const w=workspace({colleges:[college({name:'学'.repeat(35)+',;\\\nBEGIN:VEVENT',deadline:'2026-11-01'})]});const ics=C.calendar(w,new Date(updatedAt));
  assert.equal(ics.split('\r\n').filter(line=>line==='BEGIN:VEVENT').length,1);
  assert.ok(ics.includes('\\nBEGIN:VEVENT'));assert.ok(ics.includes('\\,'));assert.ok(ics.includes('\\;'));
  for(const line of ics.split('\r\n'))assert.ok(new TextEncoder().encode(line).length<=75);
  assert.ok(!ics.includes('\ufffd'));
});
test('backups round-trip every essay, notes, completion, and archived record',()=>{
  const w=workspace({colleges:[college({notes:'Research\nnotes',archived:true})],tasks:[task({completed:true})],essays:[essay({prompt:'Why here?',draft:'Because\nI care.',wordLimit:100,status:'review'})]});
  assert.deepEqual(C.validate(JSON.parse(JSON.stringify(w))),w);
});
function remoteClient(result) {
  const calls=[];const chain={};
  for(const method of ['from','insert','update','eq','select'])chain[method]=(...args)=>{calls.push([method,...args]);return chain;};
  chain.single=async()=>result;chain.maybeSingle=async()=>result;
  return {client:chain,calls};
}
test('first account save inserts only into the signed-in owner workspace',async()=>{
  const {client,calls}=remoteClient({data:{revision:1},error:null});
  assert.equal(await C.saveRemote(client,'owner-one',workspace(),0),1);
  assert.deepEqual(calls[0],['from','college_application_workspaces']);
  const inserted=calls.find(c=>c[0]==='insert')[1];assert.equal(inserted.user_id,'owner-one');assert.equal(inserted.revision,1);
  assert.equal(calls.some(c=>c[0]==='update'),false);
});
test('subsequent account saves require both the owner and exact previous revision',async()=>{
  const {client,calls}=remoteClient({data:{revision:5},error:null});
  assert.equal(await C.saveRemote(client,'owner-one',workspace(),4),5);
  assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='user_id'&&c[2]==='owner-one'));
  assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='revision'&&c[2]===4));
  assert.equal(calls.some(c=>c[0]==='insert'),false);
});
test('a stale revision stops account saving instead of falling back to an unconditional upsert',async()=>{
  const {client,calls}=remoteClient({data:null,error:null});
  await assert.rejects(C.saveRemote(client,'owner-one',workspace(),4),/Another device/);
  assert.equal(calls.filter(c=>c[0]==='update').length,1);assert.equal(calls.some(c=>c[0]==='insert'),false);
});
test('invalid or signed-out data never reaches the account database',async()=>{
  const {client,calls}=remoteClient({data:{revision:1},error:null});
  await assert.rejects(C.saveRemote(client,'',workspace(),0));
  await assert.rejects(C.saveRemote(client,'owner-one',{version:2},0));
  await assert.rejects(C.saveRemote(client,'owner-one',workspace(),-1));assert.equal(calls.length,0);
});
test('network or access errors preserve the source workspace for a local retry',async()=>{
  const w=workspace({essays:[essay({draft:'Keep this draft.'})]});const before=JSON.stringify(w);
  const {client}=remoteClient({data:null,error:new Error('connection failed')});
  await assert.rejects(C.saveRemote(client,'owner-one',w,1),/connection failed/);assert.equal(JSON.stringify(w),before);
});
