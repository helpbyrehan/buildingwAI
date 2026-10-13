(function(){
  'use strict';
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=value=>Number(value.toFixed(2)).toLocaleString(undefined,{maximumFractionDigits:2});
  const engine=window.APScoreEngine,data=window.APScoreModels;
  if(!engine||!data){$('#resultMessage').textContent='The calculator could not load. Reload this page to try again.';return;}
  let subject=data.subjects.find(item=>item.id==='physics-1')||data.subjects[0];
  let profile=subject.profiles[0],scores=profile.fields.map(()=>''),activeModel=profile,lastResult=null;
  const aliases={'united-states-history':'apush us history','world-history-modern':'whap ap world','united-states-government-and-politics':'ap gov gopo','human-geography':'aphug ap hug','english-language-and-composition':'ap lang','english-literature-and-composition':'ap lit','statistics':'stats','computer-science-a':'csa cs a','computer-science-principles':'csp cs principles','environmental-science':'apes','calculus-ab':'calc ab','calculus-bc':'calc bc'};
  const names=['No recommendation','Possibly qualified','Qualified','Very well qualified','Extremely well qualified'];

  function renderSubjects(){
    const term=$('#subjectSearch').value.trim().toLowerCase();
    const matches=data.subjects.filter(item=>(item.name+' '+item.category+' '+(aliases[item.id]||'')).toLowerCase().includes(term));
    const groups=[...new Set(matches.map(item=>item.category))];
    let html='';
    if(!matches.includes(subject))html=`<optgroup label="Current subject"><option value="${subject.id}">${esc(subject.name)}</option></optgroup>`;
    groups.forEach(group=>{html+=`<optgroup label="${esc(group)}">${matches.filter(item=>item.category===group).map(item=>`<option value="${item.id}">${esc(item.name)}</option>`).join('')}</optgroup>`;});
    if(!matches.length)html+='<option disabled>No matching subjects</option>';
    $('#calcSubject').innerHTML=html;$('#calcSubject').value=subject.id;
    $('#subjectCount').textContent=`${matches.length} of ${data.subjects.length} subjects${term?' match your search':''}`;
  }
  function renderProfile(){
    $('#calcModel').innerHTML=subject.profiles.map(item=>`<option value="${esc(item.id)}">${esc(item.label)}</option>`).join('');$('#calcModel').value=profile.id;
    $('#subjectHeading').textContent=subject.name;
    $('#modelBadge').textContent=profile.kind==='composite'?'Composite only':profile.kind==='reference'?'Historical reference':'Projected curve';
    $('#modelNote').textContent=profile.note;
    $('#scoreFields').innerHTML=profile.fields.map((field,i)=>{
      const share=field.max*field.weight/profile.scale*100;
      return `<div class="calc-field"><div class="calc-field-top"><label for="score-${i}">${esc(field.label)}<span class="calc-weight">${fmt(share)}% of composite${field.unit==='percent'?' · enter rubric percentage':''}</span></label><div class="calc-number-wrap"><input class="calc-number" id="score-${i}" type="number" min="0" max="${field.max}" step="${field.step}" inputmode="${field.step===1?'numeric':'decimal'}" aria-describedby="score-error-${i}" placeholder="—"><span>${field.unit==='percent'?'%':'/ '+field.max}</span></div></div><input class="calc-slider" id="slider-${i}" type="range" min="0" max="${field.max}" step="${field.step}" value="0" aria-label="${esc(field.label)} slider"><div class="calc-range-labels"><span>0</span><span>${field.max}${field.unit==='percent'?'%':' points'}</span></div><p class="calc-error" id="score-error-${i}"></p></div>`;
    }).join('');
    profile.fields.forEach((field,i)=>{
      const number=$('#score-'+i),slider=$('#slider-'+i);number.value=scores[i];slider.value=scores[i]||0;
      number.addEventListener('input',()=>{scores[i]=number.value;if(number.validity.valid)slider.value=number.value||0;renderResults();});
      slider.addEventListener('input',()=>{scores[i]=slider.value;number.value=slider.value;renderResults();});
    });
    $('#useCustom').checked=false;$('#customRounding').value=profile.rounding==='none'?'none':'nearest';
    $('#customCutoffFields').innerHTML=[2,3,4,5].map(score=>`<div class="field"><label for="cutoff-${score}">Score ${score} minimum</label><input class="input" id="cutoff-${score}" type="number" min="0" max="${profile.scale}" step="any" inputmode="decimal" placeholder="0–${profile.scale}"></div>`).join('');
    $('#customCutoffFields').querySelectorAll('input').forEach(input=>input.addEventListener('input',renderResults));
    $('#worksheetDetails').open=profile.kind==='composite';
    const sources=[{title:'College Board: exam format and assessment',url:subject.officialUrl},{title:profile.source+': scoring model',url:profile.sourceUrl},{title:'College Board: how exam versions are equated',url:'https://apcentral.collegeboard.org/help-center/what-equating-processes-does-ap-use'}];
    const seen=new Set();$('#calcSources').innerHTML=sources.filter(item=>{if(seen.has(item.url))return false;seen.add(item.url);return true;}).map(item=>`<li><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)} ↗</a></li>`).join('');
    $('#specialNote').textContent=subject.id==='calculus-bc'?'This calculator estimates the overall Calculus BC score. An AB subscore needs separate AB-specific responses and is not inferred from your BC total.':subject.id==='music-theory'?'This calculator estimates the overall Music Theory score. Aural and nonaural subscores are not inferred from the overall result.':profile.kind==='composite'?'For this assessment, the weighted composite is available without a curve. A 1–5 estimate needs a matching scoring worksheet; no universal percentage-to-AP conversion is applied.':'';
    $('#copyStatus').textContent='';renderResults();
  }
  function getActiveModel(){
    $('#cutoffError').textContent='';
    if(!$('#useCustom').checked)return profile;
    try{return engine.customModel(profile,[2,3,4,5].map(score=>$('#cutoff-'+score).value),$('#customRounding').value);}
    catch(error){$('#cutoffError').textContent=error.message;return {...profile,cutoffs:null,kind:'custom'};}
  }
  function renderResults(){
    activeModel=getActiveModel();const result=engine.calculate(activeModel,scores);lastResult=result;
    profile.fields.forEach((_field,i)=>{
      const error=result.errors.find(item=>item.index===i);
      $('#score-'+i).setAttribute('aria-invalid',String(!!error));$('#score-error-'+i).textContent=error?.message||'';
    });
    const hasBand=!!activeModel.cutoffs;
    $('#resultLabel').textContent=hasBand?'Estimated AP score':'Weighted composite';
    $('#resultBadge').textContent=activeModel.kind==='custom'?'Your worksheet':hasBand?'Practice estimate':'Curve needed';
    $('#predictedScore').textContent=result.complete?(hasBand?result.score:fmt(result.percentage)):'—';
    $('#scoreSuffix').textContent=hasBand?'/ 5':'%';
    let message=result.errors.length?'Check the highlighted inputs before calculating.':'Add every section score to see your result. Use 0 for sections where you earned no points.';
    if(result.complete){
      message=hasBand?names[result.score-1]+'. This is an estimate using the selected model.':'Your section weights are calculated. Enter matching worksheet cutoffs above for a 1–5 estimate.';
      if(hasBand&&activeModel.cutoffs.some(cutoff=>Math.abs(result.composite-cutoff)/activeModel.scale*100<=3))message+=' You are close to a cutoff; a different exam curve could change the prediction.';
    }
    $('#resultMessage').textContent=message;
    $('#compositeScore').textContent=result.complete?`${fmt(result.composite)} / ${activeModel.scale}`:'—';
    $('#compositePercent').textContent=result.complete?fmt(result.percentage)+'%':'—';
    $('#compositeMarker').style.left=(result.complete?result.percentage:0)+'%';
    $('#scoreBands').innerHTML=hasBand?[1,2,3,4,5].map(score=>{
      const low=score===1?0:activeModel.cutoffs[score-2],high=score===5?activeModel.scale:activeModel.cutoffs[score-1];
      return `<div class="${result.score===score?'current':''}"><strong>${score}</strong>${fmt(low)}${score===5?'+':'–<'+fmt(high)}</div>`;
    }).join(''):'';
    $('#roundingNote').textContent=hasBand?(activeModel.rounding==='nearest'?`The final composite${result.complete?' ('+result.rounded+')':''} is rounded once, to the nearest whole point, before applying these cutoffs.`:'This worksheet compares the exact composite without rounding.'):'The weighted result is shown without applying an invented AP curve.';
    $('#sectionBreakdown').innerHTML=result.complete?profile.fields.map((field,i)=>`<div class="calc-breakdown-row"><span>${esc(field.label)}</span><strong>${fmt(result.contributions[i])} pts</strong><div class="calc-mini-track"><span style="width:${result.values[i]/field.max*100}%"></span></div></div>`).join(''):'';
    $('#comparison').innerHTML='';
    if(result.complete&&hasBand&&activeModel.kind!=='custom'){
      const others=subject.profiles.filter(item=>item.id!==profile.id&&item.cutoffs&&engine.compatible(profile,item)).slice(0,3);
      if(others.length)$('#comparison').innerHTML='<strong>Compare matching reference models</strong>'+others.map(item=>`${esc(item.label)}: estimated ${engine.calculate(item,scores).score}`).join('<br>')+'<br>These are separate model outputs, not probabilities or an averaged score.';
    }
    $('#copyResult').disabled=!result.complete;renderTarget();
  }
  function renderTarget(){
    const target=Number($('#targetScore').value),result=lastResult;
    $('#targetOptions').innerHTML='';
    if(!result?.complete){$('#targetSummary').textContent='Complete your section scores to see the smallest gains that reach your target.';return;}
    if(!activeModel.cutoffs){$('#targetSummary').textContent='A matching worksheet curve is needed to calculate a target AP score. Your composite is still available above.';return;}
    if(result.score>=target){$('#targetSummary').textContent=`Your current inputs already reach a ${target} in this model. Keep practicing to build a margin above the cutoff.`;return;}
    $('#targetSummary').textContent=`Ways to reach a ${target}, improving one component while holding every other score fixed. These goals use the selected curve.`;
    const plan=engine.targetPlan(activeModel,scores,target),possible=plan.filter(item=>item.needed!==null).sort((a,b)=>a.needed/profile.fields[a.index].max-b.needed/profile.fields[b.index].max).slice(0,4);
    if(!possible.length){$('#targetOptions').textContent='No single component can reach this target alone. Try improvements across several sections.';return;}
    $('#targetOptions').innerHTML=possible.map(item=>{const field=profile.fields[item.index];return `<div class="calc-target-row"><span>${esc(field.label)}<br>${fmt(item.total)} / ${field.max}${field.unit==='percent'?'%':''} needed</span><strong>+${fmt(item.needed)} ${field.unit==='percent'?'percentage pts':'raw pts'}</strong></div>`;}).join('');
  }
  function setScores(mode){
    scores=profile.fields.map(field=>mode==='clear'?'':mode==='max'?field.max:Number((Math.round(field.max*.6/field.step)*field.step).toFixed(6)));
    profile.fields.forEach((_field,i)=>{$('#score-'+i).value=scores[i];$('#slider-'+i).value=scores[i]||0;});renderResults();
  }
  $('#subjectSearch').addEventListener('input',renderSubjects);
  $('#calcSubject').addEventListener('change',()=>{subject=data.subjects.find(item=>item.id===$('#calcSubject').value);profile=subject.profiles[0];scores=profile.fields.map(()=>'');renderSubjects();renderProfile();});
  $('#calcModel').addEventListener('change',()=>{const next=subject.profiles.find(item=>item.id===$('#calcModel').value);if(!engine.compatible(profile,next))scores=next.fields.map(()=>'');profile=next;renderProfile();});
  $('#loadExample').addEventListener('click',()=>setScores('example'));
  $('#maxScores').addEventListener('click',()=>setScores('max'));
  $('#resetScores').addEventListener('click',()=>setScores('clear'));
  $('#useCustom').addEventListener('change',renderResults);$('#customRounding').addEventListener('change',renderResults);$('#targetScore').addEventListener('change',renderTarget);
  $('#copyResult').addEventListener('click',async()=>{
    if(!lastResult.complete)return;
    const message=[`${subject.name} — ${profile.label}`,lastResult.score!==null?`Estimated AP score: ${lastResult.score}/5`:'Weighted composite only; no curve supplied.',`Composite: ${fmt(lastResult.composite)}/${activeModel.scale} (${fmt(lastResult.percentage)}%)`,...profile.fields.map((field,i)=>`${field.label}: ${scores[i]}/${field.max}${field.unit==='percent'?'%':''}`),activeModel.kind==='custom'?`Custom worksheet cutoffs (2–5): ${activeModel.cutoffs.join(', ')}`:`Model source: ${profile.sourceUrl}`,'Practice estimate, not an official College Board result.'].join('\n');
    try{await navigator.clipboard.writeText(message);$('#copyStatus').textContent='Result copied.';}catch{$('#copyStatus').textContent='Copy is unavailable in this browser. You can select the result text manually.';}
  });
  renderSubjects();renderProfile();
})();
