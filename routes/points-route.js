const express = require('express');
const { fetchRosters, getPointsAndLineup } = require('../roster');

// Create router
const router = express.Router();

router.get('/', async (req, res) => {
	let lineup = req.query.lineup ? {} : false;
	let scores = req.query.scores ? {} : false;
	try {
		const result = await fetchRosters(req.query.week, req.query.leagueId);
		result.forEach((x) => getPointsAndLineup(x.homeRoster, scores, lineup, result.sundayTeams));
		result.forEach((x) => getPointsAndLineup(x.awayRoster, scores, lineup, result.sundayTeams));
		res.send({ scores, lineup });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
