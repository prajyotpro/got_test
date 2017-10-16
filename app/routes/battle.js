var Battle        = require('../controllers/battle');
var express 		= require('express');
var router 			= express.Router();

router.get('/list',   Battle.getBattlePlaces);
router.get('/count',  Battle.getBattleCount);
router.get('/stats',  Battle.getBattleStats);
router.get('/search', Battle.searchBattles);

module.exports = router;
