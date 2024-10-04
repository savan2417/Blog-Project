const mongoose = require("mongoose");

async function connecteDB(url){
  await mongoose.connect(url);
}

module.exports = connecteDB