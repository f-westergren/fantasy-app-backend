const knex = require('./../db');
const { fetchRosters, getPointsAndLineup } = require('../roster');

// Retrieve all users
exports.picksAll = async (req, res) => {
	knex
		.select('username', 'roster')
		.from('picks')
		.then(async (rows) => {
			let results = [];
			if (!rows.length) {
				res.json(results);
			} else {
				// Get points from ESPN.
				const points = {};
				const result = await fetchRosters(req.query.week, req.query.leagueId);
				result.forEach((x) => getPointsAndLineup(x.homeRoster, points, false, result.sundayTeams));
				result.forEach((x) => getPointsAndLineup(x.awayRoster, points, false, result.sundayTeams));

				// Add points to rosters.

				for (let row of rows) {
					let score = 0;
					let resultRoster = JSON.parse(row.roster);
					Object.keys(resultRoster).map((r) => {
						let best = resultRoster[r][0]
						let worst = resultRoster[r][1]
						if (points[best] !== undefined && points[worst] !== undefined) {
							score += points[best]
							score -= points[worst]
						}
					});
					row.roster = resultRoster
					row.score = score;
					results.push(row);
				}
				results = results.sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));
				res.json(results);
			}
		})
		.catch((err) => {
			res.status(500).send({ message: `There was an error retrieving picks: ${err}` });
		});
};

exports.picksOne = async (req, res) => {
	knex
		.select('*')
		.from('picks')
		.where({
			username: req.params.username
		})
		.then((rows) => {
			if (rows.length) res.send(rows[0]);
		})
		.catch((err) => {
			res.json({ message: `There was an error retreiving pick: ${err}` });
		});
};

// Create new user
exports.picksCreate = async (req, res) => {
	const { roster, username, week } = req.body;
	// Check if a pick exists first.
	knex
		.select('username')
		.from('picks')
		.where({
			username: username
		})
		.then((rows) => {
			if (rows.length !== 0)
				res.status(400).json({ message: "You've already submitted a pick. Edit it instead." });
			else {
				knex('picks')
					.insert({ roster, username, week })
					.then(() => {
						res.json({ message: `Picks for week \'${week}\' created.` });
					})
					.catch((err) => {
						res.json({ message: `There was an error creating picks: ${err}` });
					});
			}
		});
};

exports.picksUpdate = async (req, res) => {
	knex('picks')
		.where({ username: req.body.username })
		.update({ roster: req.body.roster })
		.then(() => {
			res.json({ message: `Roster updated.` });
		})
		.catch((err) => {
			res.json({ message: `There was an error updating roster: ${err}` });
		});
};

// Remove all books on the list
exports.picksReset = async (req, res) => {
	// Remove all books from database
	knex
		.select('*') // select all records
		.from('picks') // from 'picks' table
		.truncate() // remove the selection
		.then(() => {
			// Send a success message in response
			res.json({ message: 'Picks list cleared.' });
		})
		.catch((err) => {
			// Send a error message in response
			res.json({ message: `There was an error resetting picks list: ${err}.` });
		});
};
