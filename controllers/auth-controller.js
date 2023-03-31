const knex = require('../db');
const { comparePass, createToken } = require('../auth/_helpers');

exports.authenticate = async (req, res) => {
	const { username, password } = req.body;
	knex('users')
		.where({ username })
		.first()
		.then((user) => {
			if (!user) return res.status(401).json({ message: 'Invalid credentials' });
			else if (!comparePass(password, user.password)) {
				return res.status(401).json({
					message: 'Invalid credentials'
				});
			} else {
				res.send({ token: createToken(username) });
			}
		})
		.catch((err) => {
			res.json({ message: `There was an error logging in: ${err}` });
		});
};
