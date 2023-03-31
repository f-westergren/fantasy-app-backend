const knex = require('./db');
const picksRoutes = require('./controllers/picks-controller.js');
const schedule = require('node-schedule');

const saveResults = async () => {
	knex
		.select('*')
		.from('picks')
		.then((rows) => {
			if (rows) {
				rows.forEach((row) =>
					knex('scores')
						.insert({ username: row.username, week: row.week, roster: row.roster })
						.catch((err) => {
							console.log(`There was an error ${err}`);
						})
				);
			}
			console.log('Results saved to database scores');
		})
		.catch((err) => {
			console.log(`There was an error ${err}`);
		});
};

const resetResults = async () => {
	knex.select('*').from('picks').truncate().then(console.log('Picks deleted.'));
};


saveResults();