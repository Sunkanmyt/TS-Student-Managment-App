const { MongoClient } = require("mongodb");

let dbConnection;
const uri =
  "mongodb+srv://admin:administrator@cluster38135.z7pbyia.mongodb.net/bookstore?retryWrites=true&w=majority";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
