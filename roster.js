const { Client } = require("espn-fantasy-football-api/node");
require("dotenv").config();

const { SWID, ESPNS2, leagueId } = process.env;

// const WEEKS = {
// 	11: '20211121',
// 	12: '20211128',
// 	13: '20211205',
// 	14: '20211212',
// 	15: '20211219',
// 	16: '20211226'
// }

const getPointsAndLineup = (roster, scores, lineup, teams) => {
	roster.forEach((r) => {
		let pos = r.player.defaultPosition;
		if (
			r.position !== "Bench" &&
			r.position !== "K" &&
			teams.indexOf(r.player.proTeam) !== -1
		) {
			// Rename keys because ESPNs weird naming conventions.
			if (pos === "RB/WR") pos = "WR";
			else if (pos === "WR") pos = "TE";
			else if (pos === "TQB") pos = "QB";
			else if (pos === "D/ST") pos = "DST";

			if (lineup) {
				lineup[pos]
					? lineup[pos].push(r.player.fullName)
					: (lineup[pos] = [r.player.fullName]);
			}
			if (scores) {
				scores[r.player.fullName] =
					Math.round((r.totalPoints + Number.EPSILON) * 100) / 100;
			}
		}
	});
	return { scores, lineup };
};

const fetchRosters = async (week = 10, leagueId) => {
	const myClient = new Client({ leagueId });
	myClient.setCookies({ espnS2: ESPNS2, SWID });
	try {
		const res = await myClient.getBoxscoreForWeek({
			seasonId: 2021,
			scoringPeriodId: +week,
			matchupPeriodId: +week,
		});
		const teams = await myClient.getNFLGamesForPeriod({
			startDate: "20211114",
			endDate: "20211114",
		});
		const sundayTeams = [];
		teams.map((team) => {
			sundayTeams.push(team.homeTeam.team, team.awayTeam.team);
		});
		res["sundayTeams"] = sundayTeams;
		return res;
	} catch (err) {
		console.error(err.status);
	}
};

module.exports = { fetchRosters, getPointsAndLineup };
