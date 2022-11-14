const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  userId: { type: String, require:true },
  money: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  cooldowns: { 
    daily: { type: String, default: 0 },
    work: { type: String, default: 0 }
  },
  tempCall: { type: String, default: 0 },
  countCall: { type: String, default: 0 },
  marry: {
    married: { type: Boolean, default: false },
    with: { type: String, default: 0 },
  }
});

module.exports = model("User", userSchema, "users");
