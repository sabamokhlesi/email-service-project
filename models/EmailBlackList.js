const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailBlackList = new Schema(
    {
      AddedAt: {type:Date, default:Date.now},
      email:{type:String,required:true}
    });
  
  module.exports = mongoose.model('EmailBlackList', emailBlackList);
