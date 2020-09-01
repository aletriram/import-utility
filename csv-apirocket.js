const csv = require('csv-parser');
const fs = require('fs');
const { jsonToGraphQLQuery, EnumType } = require('json-to-graphql-query');
const axios = require('axios');

const filename = 'NOTICIAS.csv'
const APIKEY = '';
const APIURL = '';

fs.createReadStream(`tmp/${filename}`).pipe(csv()).on('data', (row) => {

	let query = {

	}

	return axios.post('', { query: jsonToGraphQLQuery(query) }, config).then((res) => {

	}).catch(error => {
		console.log(error.message);
	});
}).on('end', () => {
	console.log('CSV file successfully processed');
});