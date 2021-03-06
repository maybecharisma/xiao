const { Command } = require('discord.js-commando');
const questions = require('../../assets/json/would-you-rather');

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather'],
			group: 'random',
			memberName: 'would-you-rather',
			description: 'Responds with a random "Would you rather ...?" question.'
		});
	}

	run(msg) {
		return msg.say(questions[Math.floor(Math.random() * questions.length)]);
	}
};
