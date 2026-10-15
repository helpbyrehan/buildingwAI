const {examples}=require('../server/essay-examples');
const {checkLibrary}=require('../server/essay-library-policy');
console.log('Essay teaching library:',checkLibrary(examples));
console.log('This checks provenance fields and consistency, not educational quality or training accuracy.');
