const {test} = require('node:test');
const assert = require('node:assert/strict');
const {cleanText,validate,parse,generateStudyAid,MODEL}=require('../server/study-engine');
test('original formula cleanup handles escaped and JSON-decoded LaTeX',()=>{
  assert.equal(cleanText('\\frac{a}{b}'),' (a)/(b)'.trim());
  assert.equal(cleanText('\frac{a}{b}'),'(a)/(b)');
  assert.deepEqual(parse({response:'```json\n{"title":"Test"}\n```'}),{title:'Test'});
});
test('original circular-motion check rejects equivalent correct choices',()=>{
  const issues=validate('quiz',{mode:'quiz',title:'Circular motion',questions:[{question:'Which formula describes circular motion?',choices:['F = m*a','F = m*v^2/r','F = m*r','F = m/v'],correct_index:0,explanation:'The net force points toward the center.'}]},1);
  assert.ok(issues.some(x=>x.includes('equivalent correct formulas')));
});
test('original answer-position and normalized-duplicate checks remain',()=>{
  const questions=Array.from({length:4},(_,i)=>({question:`Question number ${i}?`,choices:['One','Two','Three','Four'],correct_index:0,explanation:'An explanatory sentence.'}));
  assert.ok(validate('quiz',{mode:'quiz',title:'Quiz',questions},4).some(x=>x.includes('vary across positions')));
  assert.ok(validate('flashcards',{mode:'flashcards',title:'Cards',cards:[{front:'Net-force',back:'Answer'},{front:'Net−force',back:'Answer'}]},2).some(x=>x.includes('duplicated')));
});
test('REST adapter preserves schema, model, settings and passes quality errors into repair',async()=>{
  const original=global.fetch;const bodies=[];
  global.fetch=async(url,options)=>{
    assert.ok(url.endsWith(MODEL));bodies.push(JSON.parse(options.body));
    return Response.json({success:true,result:{response:{mode:'summary',title:'Cells',summary:bodies.length===1?'short':'Cells are the basic units of life and contain specialized structures called organelles.',key_terms:[],warnings:[]}}});
  };
  try {
    const answer=await generateStudyAid({CLOUDFLARE_ACCOUNT_ID:'example',CLOUDFLARE_API_TOKEN:'secret'},{mode:'summary',content:'Cell notes',course:'Biology',difficulty:'medium'},5,5);
    assert.equal(answer.model,MODEL);assert.equal(bodies.length,2);
    assert.equal(bodies[0].response_format.type,'json_schema');
    assert.equal(bodies[0].temperature,0.15);assert.equal(bodies[0].max_tokens,900);
    assert.ok(bodies[1].messages[1].content.includes('summary must contain 40-4000 characters'));
  } finally {global.fetch=original;}
});
