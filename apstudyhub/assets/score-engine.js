(function(root,factory){
  const engine=factory();
  if(typeof module==='object'&&module.exports)module.exports=engine;
  else root.APScoreEngine=engine;
})(typeof window==='object'?window:this,function(){
  'use strict';
  function validate(model,scores){
    const values=[],errors=[];
    model.fields.forEach((field,i)=>{
      const raw=scores[i];
      if(raw===''||raw===null||raw===undefined){values.push(null);return;}
      const value=Number(raw);
      if(!Number.isFinite(value)||value<0||value>field.max||Math.abs(value/field.step-Math.round(value/field.step))>1e-7){
        errors.push({index:i,message:`Use ${field.unit==='percent'?'a percentage':'points'} from 0 to ${field.max}${field.step===1?' in whole numbers':''}.`});
      }
      values.push(value);
    });
    return {values,errors,complete:errors.length===0&&values.every(value=>value!==null)};
  }
  function band(model,composite){
    if(!model.cutoffs)return null;
    const score=model.rounding==='nearest'?Math.round(composite+1e-9):composite;
    return 1+model.cutoffs.filter(cutoff=>score>=cutoff-1e-9).length;
  }
  function calculate(model,scores){
    const checked=validate(model,scores);
    if(!checked.complete)return {...checked,composite:null,score:null};
    const contributions=checked.values.map((value,i)=>value*model.fields[i].weight);
    const composite=Math.min(model.scale,Math.max(0,contributions.reduce((a,b)=>a+b,0)));
    return {...checked,contributions,composite,percentage:composite/model.scale*100,rounded:model.rounding==='nearest'?Math.round(composite+1e-9):composite,score:band(model,composite)};
  }
  function customModel(model,cutoffs,rounding='nearest'){
    if(!Array.isArray(cutoffs)||cutoffs.length!==4||cutoffs.some(value=>value===''||value===null||!Number.isFinite(Number(value))))throw new Error('Enter all four worksheet cutoffs.');
    const values=cutoffs.map(Number);
    if(values.some((value,i)=>value<=0||value>model.scale||(i>0&&value<=values[i-1])))throw new Error(`Cutoffs must increase from score 2 to 5 and stay above 0 and at or below ${model.scale}.`);
    if(!['nearest','none'].includes(rounding))throw new Error('Choose a valid rounding rule.');
    return {...model,cutoffs:values,rounding,kind:'custom'};
  }
  function targetPlan(model,scores,target){
    if(!Number.isInteger(target)||target<2||target>5)throw new Error('Choose a target from 2 to 5.');
    const result=calculate(model,scores);
    if(!result.complete||!model.cutoffs)return [];
    return model.fields.map((field,index)=>{
      if(result.score>=target)return {index,needed:0,total:result.values[index]};
      const start=Math.round(result.values[index]/field.step),end=Math.floor(field.max/field.step);
      let low=start,high=end;
      const test=step=>{const candidate=[...result.values];candidate[index]=Number((step*field.step).toFixed(6));return calculate(model,candidate).score>=target;};
      if(!test(high))return {index,needed:null,total:null};
      while(low<high){const middle=Math.floor((low+high)/2);if(test(middle))high=middle;else low=middle+1;}
      const total=Number((low*field.step).toFixed(6));
      return {index,total,needed:Number((total-result.values[index]).toFixed(6))};
    });
  }
  function compatible(a,b){
    return a.fields.length===b.fields.length&&a.fields.every((field,i)=>field.max===b.fields[i].max&&field.unit===b.fields[i].unit&&field.step===b.fields[i].step);
  }
  return {validate,band,calculate,customModel,targetPlan,compatible};
});
