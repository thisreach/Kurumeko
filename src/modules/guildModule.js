const Guild = require('../schemas/guild')

module.exports = class GuildModule {
	
	static async createServer(id) {
		const result = new Guild({
			guildId: id,
			joinedAt: Date.now(),
			autoRole: 0,
			autoRoleEnable: false,
			channelVerify: 0,
			welcomeMessageEnable: false,
			welcomeMessage: 0,
			punishMessageEnable: true,
			punishMessage: 0,
			antiLink: false,
			roleBoy: 0,
			roleGirl: 0,
			roleGay: 0,
			roleAdult: 0,
			roleBaby: 0,
		});

		await result.save();

		return result;
	}
};