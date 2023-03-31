const path = require('path');
const dbPath = path.resolve(__dirname, 'db/db3.sqlite');

// Create connection to SQLite database
const knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: dbPath
	},
	useNullAsDefault: true
});

knex.schema
	// Make sure no "users" table exists
	// before trying to create new
	.hasTable('users')
	.then((exists) => {
		if (!exists) {
			return knex.schema
				.createTable('users', (table) => {
					table.increments('id').primary();
					table.string('username').unique();
					table.string('password');
				})
				.then(() => {
					// Log success message
					console.log("Table 'Users' created");
				})
				.catch((error) => {
					console.error(`There was an error creating table: ${error}`);
				});
		}
	})
	.catch((error) => {
		console.error(`There was an error setting up the database: ${error}`);
	});

knex.schema
	// Make sure no "users" table exists
	// before trying to create new
	.hasTable('picks')
	.then((exists) => {
		if (!exists) {
			return knex.schema
				.createTable('picks', (table) => {
					table.increments('id').primary();
					table.string('username');
					table.string('week');
					table.string('roster');
					table.foreign('username').references('username').inTable('users');
				})
				.then(() => {
					// Log success message
					console.log("Table 'Picks' created");
				})
				.catch((error) => {
					console.error(`There was an error creating table: ${error}`);
				});
		}
	})
	.catch((error) => {
		console.error(`There was an error setting up the database: ${error}`);
	});

knex.schema
	// Make sure no "users" table exists
	// before trying to create new
	.hasTable('scores')
	.then((exists) => {
		if (!exists) {
			return knex.schema
				.createTable('scores', (table) => {
					table.increments('id').primary();
					table.string('username');
					table.string('week');
					table.string('roster');
					table.foreign('username').references('username').inTable('users');
				})
				.then(() => {
					// Log success message
					console.log("Table 'Scores' created");
				})
				.catch((error) => {
					console.error(`There was an error creating table: ${error}`);
				});
		}
	})
	.catch((error) => {
		console.error(`There was an error setting up the database: ${error}`);
	});

// Export the database
module.exports = knex;
