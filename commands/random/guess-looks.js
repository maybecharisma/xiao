const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { randomRange } = require('../../util/Util');
const genders = ['male', 'female'];
const { eyeColors, hairColors, hairStyles, extras } = require('../../assets/json/guess-looks');

module.exports = class GuessLooksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'guess-looks',
			aliases: ['guess-my-looks'],
			group: 'random',
			memberName: 'guess-looks',
			description: 'Guesses what a user looks like.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want me to guess the looks of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const gender = genders[Math.floor(Math.random() * genders.length)];
		const eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
		const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
		const hairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
		const age = randomRange(10, 100);
		const feet = randomRange(3, 7);
		const inches = Math.floor(Math.random() * 12);
		const weight = randomRange(50, 300);
		const extra = extras[Math.floor(Math.random() * extras.length)];
		return msg.say(oneLine`
			I think ${user.username} is a ${age} year old ${gender} with ${eyeColor} eyes and ${hairStyle} ${hairColor}
			hair. They are ${feet}'${inches}" and weigh ${weight} pounds. Don't forget the ${extra}!
		`);
	}
};
