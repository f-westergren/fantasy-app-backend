const knex = require('./../db');
const { fetchRosters, getPointsAndLineup } = require('../roster');
const e = require('express');

const scoresAll = async (req, res) => {
	knex
		.select('*')
		.from('scores')
		.then((rows) => {
			res.json(rows);
		})
		.catch((err) => {
			res.json({ message: `There was an error retrieving scores: ${err}` });
		});
};

const scoresCreate = async (req, res) => {
	const { username, week, roster } = req.body;

	knex('scores')
		.insert({ username, week, roster })
		.then(() => {
			res.json({ message: `Scores for week ${week} created.` });
		})
		.catch((err) => {
			res.json({ message: `There was an error creating scores: ${err}` });
		});
};

const scoresOne = async (req, res) => {
	knex
		.select('*')
		.from('scores')
		.where({
			username: req.body.username,
			week: req.body.week
		})
		.then((rows) => {
			if (rows.length) res.send(rows[0]);
		})
		.catch((err) => {
			res.json({ message: `There was an error retreiving score: ${err}` });
		});
};

const scoresUpdate = async (req, res) => {
	knex('scores')
		.where({ id: req.body.id })
		.update({ week: req.body.week })
		.then(() => {
			res.json({ message: `Scores updated.` });
		})
		.catch((err) => {
			res.json({ message: `There was an error updating scores: ${err}` });
		});
};

module.exports = { scoresAll, scoresCreate, scoresOne, scoresUpdate };
