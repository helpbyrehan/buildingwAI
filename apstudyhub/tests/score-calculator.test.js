const {test}=require('node:test');
const assert=require('node:assert/strict');
const {subjects}=require('../assets/score-models');
const E=require('../assets/score-engine');
const current=id=>subjects.find(subject=>subject.id===id).profiles[0];
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('catalog contains all 42 official subjects, unique models, and explicit provenance',()=>{
  assert.equal(subjects.length,42);assert.equal(new Set(subjects.map(s=>s.id)).size,42);
  for(const s of subjects){
    assert.match(s.officialUrl,/^https:\/\/apcentral\.collegeboard\.org\//);
    assert.equal(new Set(s.profiles.map(p=>p.id)).size,s.profiles.length);
    for(const p of s.profiles){
      assert.match(p.sourceUrl,/^https:\/\//);assert.ok(p.scale>0);
      assert.equal(new Set(p.fields.map(f=>f.id)).size,p.fields.length);
      assert.ok(p.fields.every(f=>f.max>0&&f.weight>0&&f.step>0));
      if(p.cutoffs)assert.ok(p.cutoffs.every((c,i)=>c>0&&c<=p.scale&&(i===0||c>p.cutoffs[i-1])));
    }
  }
});
test('every current format uses exactly its full composite scale',()=>{
  for(const s of subjects){const p=s.profiles[0];close(p.fields.reduce((sum,f)=>sum+f.max*f.weight,0),p.scale);close(E.calculate(p,p.fields.map(f=>f.max)).percentage,100);}
});
test('all reference models handle zero, full marks, and monotonic increases',()=>{
  for(const s of subjects)for(const p of s.profiles){
    const zero=E.calculate(p,p.fields.map(()=>0)),full=E.calculate(p,p.fields.map(f=>f.max));
    assert.equal(zero.complete,true);assert.equal(zero.composite,0);
    assert.ok(full.composite<=p.scale&&full.composite>=p.scale*.98);
    if(p.cutoffs){assert.equal(zero.score,1);assert.equal(full.score,5);}
    for(let i=0;i<p.fields.length;i++){const a=p.fields.map(()=>0),b=[...a];b[i]=p.fields[i].step;assert.ok(E.calculate(p,b).composite>E.calculate(p,a).composite);}
  }
});
test('2027 Physics 1 uses 42 MCQ and 10/12/10/8 FRQ points with a 50/50 split',()=>{
  const p=current('physics-1');assert.deepEqual(p.fields.map(f=>f.max),[42,10,12,10,8]);
  const r=E.calculate(p,[21,5,6,5,4]);close(r.composite,50);assert.equal(r.score,3);
});
test('2022 Calculus AB reference reproduces OnePrep rounded composite and score',()=>{
  const p=subjects.find(s=>s.id==='calculus-ab').profiles.find(p=>p.source==='OnePrep');
  const r=E.calculate(p,[23,5,5,5,5,5,5]);assert.equal(r.rounded,58);assert.equal(r.score,4);
});
test('Psychology exposes the disagreement between independently named source curves',()=>{
  const s=subjects.find(s=>s.id==='psychology'),scores=[60,5,5];
  const independent=s.profiles.find(p=>p.source==='OnePrep');
  assert.equal(E.compatible(s.profiles[0],independent),true);
  assert.equal(E.calculate(s.profiles[0],scores).score,4);
  const other=E.calculate(independent,scores);assert.equal(other.rounded,116);assert.equal(other.score,5);
});
test('2027 Precalculus keeps distinct MCQ Part A and B weights',()=>{
  const p=current('precalculus');assert.deepEqual(p.fields.map(f=>f.max),[29,13,6,6,6,6]);
  close(E.calculate(p,[29,0,0,0,0,0]).composite,43.75);
  close(E.calculate(p,[0,13,0,0,0,0]).composite,18.75);
  close(E.calculate(p,[0,0,6,6,6,6]).composite,37.5);
});
test('Music Theory uses 45/45/10 rather than treating sight singing as ordinary FRQ points',()=>{
  const p=current('music-theory');let values=p.fields.map(()=>0);values[9]=9;values[10]=9;
  close(E.calculate(p,values).percentage,10);
  values=p.fields.map((f,i)=>i>=2&&i<=8?f.max:0);close(E.calculate(p,values).percentage,45);
});
test('history 2027 components keep the 40/20/25/15 weights without stale rubric assumptions',()=>{
  for(const id of ['united-states-history','world-history-modern','european-history']){
    const p=current(id);assert.equal(p.fields.length,4);
    close(E.calculate(p,[55,0,0,0]).percentage,40);close(E.calculate(p,[0,100,0,0]).percentage,20);
    close(E.calculate(p,[0,0,100,0]).percentage,25);close(E.calculate(p,[0,0,0,100]).percentage,15);
  }
});
test('Capstone and art use actual component weights and never an invented default band',()=>{
  const research=current('research');close(E.calculate(research,[80,60]).composite,75);
  for(const id of ['research','seminar','2-d-art-and-design','3-d-art-and-design','drawing','chinese-language-and-culture','italian-language-and-culture','japanese-language-and-culture']){
    const p=current(id);assert.equal(E.calculate(p,p.fields.map(f=>f.max)).score,null);assert.deepEqual(E.targetPlan(p,p.fields.map(f=>f.max),5),[]);
  }
  const seminar=current('seminar');close(E.calculate(seminar,[0,0,0,0,0,100,100]).percentage,45);
  close(E.calculate(current('drawing'),[100,0]).percentage,60);
});
test('each source curve boundary is continuous and uses final-total rounding once',()=>{
  for(const s of subjects)for(const p of s.profiles)if(p.cutoffs){
    p.cutoffs.forEach((cut,i)=>{
      assert.equal(E.band(p,cut-.50001),i+1);
      assert.equal(E.band(p,cut-.5),i+2);
      assert.equal(E.band(p,cut),i+2);
    });
  }
});
test('bad, fractional, out-of-range, and incomplete raw scores do not yield predictions',()=>{
  const p=current('physics-1');
  for(const bad of ['',null,undefined,-1,43,Infinity,NaN,'abc',.5]){
    const r=E.calculate(p,[bad,5,6,5,4]);assert.equal(r.complete,false);assert.equal(r.score,null);assert.equal(r.composite,null);
  }
  assert.equal(E.calculate(p,[0,0,0,0,0]).complete,true);
});
test('custom worksheets validate every cutoff and support exact versus rounded comparisons',()=>{
  const p=current('research');
  for(const cuts of [[30,45,60,''],[30,45,45,80],[-1,40,60,80],[30,45,60,101]])assert.throws(()=>E.customModel(p,cuts));
  const exact=E.customModel(p,[30,45,60,80],'none'),rounded=E.customModel(p,[30,45,60,80],'nearest');
  assert.equal(E.band(exact,79.6),4);assert.equal(E.band(rounded,79.6),5);
  assert.equal(E.calculate(exact,[80,80]).score,5);
});
test('target planner returns minimal attainable raw gains under the selected rounding rule',()=>{
  const p=current('physics-1'),scores=[21,5,6,5,4];
  for(const target of [3,4,5])for(const plan of E.targetPlan(p,scores,target)){
    const f=p.fields[plan.index],candidate=[...scores];
    if(plan.needed===null){candidate[plan.index]=f.max;assert.ok(E.calculate(p,candidate).score<target);continue;}
    candidate[plan.index]=plan.total;assert.ok(E.calculate(p,candidate).score>=target);
    if(plan.needed>0){candidate[plan.index]-=f.step;assert.ok(E.calculate(p,candidate).score<target);}
  }
});
test('only equivalent raw-input formats can be compared or retain user scores',()=>{
  const subject=subjects.find(s=>s.id==='physics-1');
  assert.equal(E.compatible(subject.profiles[0],subject.profiles.find(p=>p.label.includes('2025'))),false);
  const csa=subjects.find(s=>s.id==='computer-science-a');assert.equal(E.compatible(csa.profiles[0],csa.profiles.find(p=>p.source==='Albert')),true);
});
