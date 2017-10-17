var async     = require('async');
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var battlesSchema = new Schema({
    name: String,
    year: Number,
    battle_number: Number,
    attacker_king: String,
    defender_king: String,
    attacker_1: String,
    attacker_2: String,
    attacker_3: String,
    attacker_4: String,
    defender_1: String,
    defender_2: String,
    defender_3: String,
    defender_4: String,
    attacker_outcome: String,
    battle_type: String,
    major_death: Number,
    major_capture: Number,
    attacker_size: Number,
    defender_size: Number,
    attacker_commander: String,
    defender_commander: String,
    summer: Number,
    location: String,
    region: String,
    note: String
});

battlesSchema.statics.getBattlePlaces = function(queryParams, callback) {

    this.find().distinct('location', { 'location' : { $nin : ['', null] } }, function(err, locations) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, locations);
    })
};

battlesSchema.statics.getBattleTypes = function(callback) {

    Battles.find().distinct('battle_type', { "battle_type" : { $nin : ["", null] } }, function(err, types) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, types);
    })
};

battlesSchema.statics.getCount = function(queryParams, callback) {

    this.count({}, function(err, count) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, count);
    })
};

battlesSchema.statics.getLatestBattle = function(queryParams, callback) {

    Battles.find({})
      .sort({$natural:-1})
      .limit(1)
      .exec(function(err, battle) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, battle);
    });
};

battlesSchema.statics.getWinCount = function(queryParams, callback) {

    Battles.count({'attacker_outcome':'win'}, function(err, count) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, count);
    });
};

battlesSchema.statics.getLossCount = function(queryParams, callback) {

    Battles.count({'attacker_outcome':'loss'}, function(err, count) {

        if (err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, count);
    });
};

battlesSchema.statics.getDefenceVariations = function(callback) {

    Battles.aggregate()
        .group({ "_id": null,
          "average" : { "$avg": "$defender_size" },
          "max"     : { "$max": "$defender_size" },
          "min"     : { "$min": "$defender_size" }
        }).exec(function (err, result){
            if(err) {
                console.log(err);
                callback(err, false);
            }

            callback(false, result);
        });
};

battlesSchema.statics.getStats = function(queryParams, callback) {

  async.waterfall([
      function(callback) {

          // Get latest active battle
          battlesSchema.statics.getLatestBattle(false, function(err, battle) {

              if (err) {
                  callback(true);
              }

              if (battle.length == 0) {
                  callback(null, {"most_active":{}});
              }

              battle = battle[0];

              var stat = {
                "most_active":{
                  "attacker_king":  battle.attacker_king,
                  "defender_king":  battle.defender_king,
                  "region":         battle.region,
                  "name":           battle.name
                  }
              };

              callback(null, stat);
          });
      },

      // Get win and loss count
      function(battle, callback) {

          battlesSchema.statics.getWinCount(false, function(err, winCount) {

              if (err) {
                  callback(true);
              }

              battlesSchema.statics.getLossCount(false, function(err, lossCount) {

                  if (err) {
                      callback(true);
                  }

                  battle['attacker_outcome'] = {"win": winCount, "loss": lossCount};
                  callback(null, battle);
              });
          });
      },

      // Get total battle types
      function(battle, callback) {

          battlesSchema.statics.getBattleTypes(function(err, types) {

              if (err) {
                  callback(true);
              }

              battle['battle_type'] = types;
              callback(null, battle);
          });
      },

      // Get defender size
      function(battle, callback) {

          battlesSchema.statics.getDefenceVariations(function(err, defence) {

              if (err) {
                  callback(true);
              }

              defence = defence[0];
              delete defence._id;
              battle['defender_size'] = defence;
              callback(null, battle);
          });
      }
  ], function (err, battleStats) {

      if (err) {
          console.log(err);
          return callback(err, false);
      }

      return callback(false, battleStats);
  });

};

battlesSchema.statics.search = function(queryParams, callback) {

    var searchQuery   = [];

    if (queryParams.king != undefined && queryParams.king.trim() != '') {
        searchQuery.push({'attacker_king': {'$regex': queryParams.king, $options:'i'}});
        searchQuery.push({'defender_king': {'$regex': queryParams.king, $options:'i'}});
    }

    if (queryParams.location != undefined && queryParams.location.trim() != '') {
        searchQuery.push({'location': {'$regex': queryParams.location, $options:'i'}});
    }

    if (queryParams.type != undefined && queryParams.type.trim() != '') {
        searchQuery.push({'battle_type': {'$regex': queryParams.type, $options:'i'}});
    }

    Battles.find( {
      $or: searchQuery
      // $and: [
      //     { $or: kingSearchQuery },
      //     { $or: otherSearchQuery }
      // ]
    },
    function(err, result){

        if(err) {
            console.log(err);
            return callback(err, false);
        }

        return callback(false, result);
    });
}

var Battles = mongoose.model('battles', battlesSchema);

module.exports = Battles;
