var config 			= require('../config/app');
var mongoose    = require('mongoose');

// Models
// var models 			= require('../models');

var Battle = function() {
};

Battle.prototype.constructor = Battle;

Battle.prototype.getBattlePlaces = function(req, res) {

	mongoose.model('battles').getBattlePlaces(false, function(err, places) {

		if (err) {
				console.log(err);
				return res.status(500);
		}
    // res.send(users);
		return res.status(200).send(places);
  });

	// console.log(User.prototype.authenticate());
	// return res.status(200).send({"users":"hii so many users!! LOL :D "});
};

Battle.prototype.getBattleCount = function(req, res) {

		mongoose.model('battles').getCount(false, function(err, count) {

			if (err) {
					console.log(err);
					return res.status(500);
			}

			return res.status(200).send({"count":count});
		});
};

Battle.prototype.getBattleStats = function(req, res) {

		mongoose.model('battles').getStats(false, function(err, stats) {

			if (err) {
					console.log(err);
					return res.status(500);
			}

			return res.status(200).send(stats);
		});
};

Battle.prototype.searchBattles = function(req, res) {

		mongoose.model('battles').search(req.query, function(err, stats) {

			if (err) {
					console.log(err);
					return res.status(500);
			}

			return res.status(200).send(stats);
		});
};

module.exports = Battle.prototype;
