const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  guildId: { type: String, require:true },
  joinedAt: String,
  autoRole: { type: String, default: 0 },
  autoRoleEnable: { type: Boolean, default: false },
  channelVerify: { type: String, default: 0 },
  channelVerifyEnable: { type: Boolean, default: false },
  welcomeMessageEnable: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: 0 },
  punishMessageEnable: { type: Boolean, default: false },
  punishMessage: { type: String, default: 0 },
  antiInvite: { type: Boolean, default: false },
  roleBoy: String,
  roleGirl: String,
  roleGay: String,
  roleAdult: String,
  roleBaby: String,
});

module.exports = model("Guild", guildSchema, "guilds");
