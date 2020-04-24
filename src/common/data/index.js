const fetch = require('./fetch');

const fileID = '013SAXWCF4PFPFL2BFENA2BSOA3ICVKHSF';

(async () => {
  await fetch(fileID, 'species');
  await fetch(fileID, 'species_groups');
  
  console.log('All done!');
})();
