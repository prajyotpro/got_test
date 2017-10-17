var Database = function() {

}

Database.prototype.getDatabase = function(environment) {

    var database = {};
    switch (environment) {
      case 'production':
            database = {
              "username": "arya",
              "password": "northremembers",
              "database": "gameofthrones",
              "host"    : "ds153113.mlab.com",
              "port"    : 53113
            };
        break;

        case 'development':
              database = {
                "username": "arya",
                "password": "northremembers",
                "database": "gameofthrones",
                "host"    : "ds153113.mlab.com",
                "port"    : 53113
              };
          break;

          case 'local':
                database = {
                  "username": "arya",
                  "password": "northremembers",
                  "database": "gameofthrones",
                  "host"    : "ds153113.mlab.com",
                  "port"    : 53113
                };
            break;
      default:
            database = {
              "username": "arya",
              "password": "northremembers",
              "database": "gameofthrones",
              "host"    : "ds153113.mlab.com",
              "port"    : 53113
            };
    }

    return database;
}

module.exports = Database.prototype;
