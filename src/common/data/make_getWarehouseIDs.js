/* eslint-disable */
const request = require('request');
const species = require('./species.data.json');

const getOptions = q => ({
  method: 'GET',
  url: 'https://warehouse1.indicia.org.uk/index.php/services/data/taxa_search',
  qs: {
    q,
    limit: '1',
    orderby: 'taxonomic_sort_order',
    mode: 'json',
    sortdir: 'ASC',
    auth_token: null,
    nonce: null,
    taxon_list_id: '258',
    synonyms: 'false',
  },
});

function get(q) {
  return new Promise((resolve, reject) => {
    request(getOptions(q), function (error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(new Error(error || response.statusMessage));
        return;
      }

      const res = JSON.parse(body);
      if (!res || !res[0]) {
        console.log();
        resolve();
        return;
      }

      const { taxa_taxon_list_id, taxon } = res[0];
      console.log(`${q}, ${taxon}, ${taxa_taxon_list_id}`);
      resolve();
    });
  });
}

async function run() {
  for (let i = 0; i < species.length; i++) {
    await get(species[i].taxon);
  }
}

run();
