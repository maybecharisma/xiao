const { Command } = require('discord.js-commando');

module.exports = class LennyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lenny',
			group: 'single',
			memberName: 'lenny',
			description: 'Responds with the lenny face.'
		});
	}

	run(msg) {
		return msg.say('( ͡° ͜ʖ ͡°)');
	}
};
