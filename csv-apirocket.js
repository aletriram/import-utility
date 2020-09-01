const csv = require('csv-parser');
const fs = require('fs');
const { jsonToGraphQLQuery, EnumType } = require('json-to-graphql-query');

const name = 'NOTICIAS.csv'
const APIKEY = '';

return true;
fs.createReadStream(`tmp/${name}`).pipe(csv()).on('data', (row) => {
	console.log(row);
}).on('end', () => {
	console.log('CSV file successfully processed');
});