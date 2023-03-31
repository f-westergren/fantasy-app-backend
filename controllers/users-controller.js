const knex = require('./../db');
const bcrypt = require('bcryptjs');
const { createToken } = require('../auth/_helpers');

// Retrieve all users
const usersAll = async (req, res) => {
	knex
		.select('*')
		.from('users')
		.then((userData) => {
			res.json(userData);
		})
		.catch((err) => {
			res.json({ message: `There was an error retrieving users: ${err}` });
		});
};

const usersOne = async (req, res) => {
	knex
		.select('*')
		.from('users')
		.where({
			username: req.params.username
		})
		.then((picksData) => {
			res.json(picksData);
		})
		.catch((err) => {
			res.json({ message: `There was an error retreiving user: ${err}` });
		});
};

// Create new user
const usersCreate = async (req, res) => {
	const { username, password, repeat_password } = req.body
	if (password !== repeat_password) res.status(400).json({ message: 'Passwords must match!'})

	// First check if user exists already.
	else {
		knex
		.select('username')
		.from('users')
		.where({
			username: req.body.username
		})
		.then(user => {
			if (user.length > 0) return res.status(400).json({ message: 'Username already exists.'})
			
			// If user doesn't exist, insert new user.
			else {
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt);
				knex('users')
					.insert({
						username: username,
						password: hash
					})
					.then(() => {
						res.json({ token: createToken(username), message: `User \'${username}\' created.` });
					})
					.catch((err) => {
						res.json({ message: `There was an error creating ${req.body.username} user: ${err}` });
					});
			}
		})
	}
};

// Remove specific user
const usersDelete = async (req, res) => {
	knex('users')
		.where('id', req.params.id) // find correct record based on id
		.del() // delete the record
		.then(() => {
			res.json({ message: `User ${req.params.id} deleted.` });
		})
		.catch((err) => {
			res.json({ message: `There was an error deleting ${req.body.id} user: ${err}` });
		});
};

module.exports = { usersDelete, usersCreate, usersOne, usersAll };