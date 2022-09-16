const fs = require('fs');
const fetchSheet = require('@flumens/fetch-onedrive-excel'); // eslint-disable-line
const po2json = require('po2json'); // eslint-disable-line

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';
const file = '01UPL42ZW5AJRZ4FMDSBFL5RGYHDCX4MPK';

function saveSpeciesToFile(data, sheetName) {
  return new Promise((resolve, reject) => {
    const fileName = `./${sheetName}.json`;
    console.log(`Writing ${fileName}`);

    fs.writeFile(fileName, JSON.stringify(data, null, 2), err => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

function checkTranslationsExist(data) {
  const jsonData = po2json.parseFileSync('../translations/interface/en.pot');
  const checkExists = sp => {
    if (!jsonData[sp.description]) {
      throw new Error(`\n\n⛑  Missing translation:\n ${sp.description}\n\n`);
    }
  };
  data.forEach(checkExists);
}

(async () => {
  const data = await fetchSheet({ drive, file, sheet: 'species' });
  await saveSpeciesToFile(data, 'species.data');
  checkTranslationsExist(data);

  await saveSpeciesToFile(
    await fetchSheet({ drive, file, sheet: 'species_groups' }),
    'species_groups.data'
  );

  console.log('All done! 🚀');
})();
