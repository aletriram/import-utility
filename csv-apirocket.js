const csv = require('csv-parser');
const fs = require('fs');
const { jsonToGraphQLQuery, EnumType } = require('json-to-graphql-query');
const axios = require('axios');
const {performance} = require('perf_hooks');
const utils = require('@aletriram/utils');
const {default: PQueue} = require('p-queue');

const filename = 'NOTICIAS.csv'
const APIKEY = 'rOYgx8MZkmqK711ZIEjOSP4Vrz56rKJpCJV7xjdn__lOaKuVuJ4vr9AoUXYQ_F5Z';
const APIURL = 'https://graphql.apirocket.io/';

let times = [];
let config = { headers: { Authorization: 'Bearer ' + APIKEY } };

const queue = new PQueue({concurrency: 20});

fs.createReadStream(`tmp/${filename}`).pipe(csv()).on('data', (row) => {

	// console.log(row);
	let query = jsonToGraphQLQuery({
		mutation: {
			NoticiaCreate: { __args: { input: getInput(row) },
				id: true
			}
		}
	}, { pretty: true });

	queue.add(() => {
		let start = performance.now();
		return axios.post(APIURL, { query }, config).then((res) => {
			let time = performance.now() - start;
			console.log('##########################' + time);
			console.log(res.data.errors);

			let errors = '';
			if (res.data.errors && res.data.errors.length) res.data.errors.map((error) => error.message).join(',');

			fs.appendFile(`tmp/${filename}-out.csv`,`${time},${res.status},${errors}\n`, function (err) { if (err) throw err; });

		}).catch(error => {
			console.log(error.message);
			fs.appendFile(`tmp/${filename}-out.csv`, `${time},${error.status},${error.message}\n`, function (err) { if (err) throw err; });
		});
	});
}).on('end', () => {
	console.log('CSV file successfully processed');
	// wirteLog(filename, times);
});


function wirteLog(filename, times) {
	fs.writeFile(`tmp/${filename}-out.csv`, times.join('\n'), function (err) {
		if (err) throw err;
		console.log('Saved time log!');
	});
}



function getInput(row) {

	let dato = {
		titulo: row.titulo ? row.titulo : row.descripcion,
		entradilla: row.entradilla,
		entradillaCorta: row.entradillaCorta,
		fecha: row.fecha,
		texto: row.texto,
	};
	if (row.relevancia == 3) {
		dato.relevancia = ['Alta'];
	} else if (row.relevancia == 2) {
		dato.relevancia = ['Media'];
	} else dato.relevancia = ['Baja'];

	if (row.destacar != '0000-00-00') {
		dato.destacar = row.destacar;
	}

	if (row.foto != '') {
		dato.foto = {
			url: `https://www.alcaladeguadaira.es/photo/noticias/${row.id}/${row.fotoV}/${utils.Strings.toUrl(row.titulo)}.jpg`
		}
		console.log(dato.foto.url);
	}

	return dato;
}