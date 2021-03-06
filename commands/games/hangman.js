const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class HangmanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hangman',
			group: 'games',
			memberName: 'hangman',
			description: 'Prevent a man from being hanged by guessing a word as fast as you can.'
		});

		this.playing = new Set();
	}

	async run(msg) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			const { body } = await snekfetch
				.get('http://api.wordnik.com/v4/words.json/randomWord')
				.query({ api_key: WORDNIK_KEY });
			const word = body.word.toLowerCase().replace(/ /g, '-');
			let points = 0;
			const confirmation = [];
			const incorrect = [];
			const display = new Array(word.length).fill('_');
			while (word.length !== confirmation.length && points < 7) {
				await msg.say(stripIndents`
					\`${display.join(' ')}\`. Which letter do you choose?
					\`\`\`
					___________
					|     |
					|     ${points > 0 ? 'O' : ''}
					|    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '—' : ''}
					|    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}
					===========
					\`\`\`
				`);
				const guess = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
					max: 1,
					time: 30000
				});
				if (!guess.size) {
					await msg.say('Sorry, time is up!');
					break;
				}
				const choice = guess.first().content.toLowerCase();
				if (choice === 'end') break;
				if (choice.length > 1) {
					if (word === choice) break;
					else await msg.say('Nope, that\'s not the word, try again!');
					points++;
				} else if (confirmation.includes(choice) || incorrect.includes(choice)) {
					await msg.say('You have already picked that letter!');
				} else if (word.includes(choice)) {
					await msg.say('Nice job!');
					for (let i = 0; i < word.length; i++) {
						if (word[i] !== choice) continue; // eslint-disable-line max-depth
						confirmation.push(word[i]);
						display[i] = word[i];
					}
				} else {
					await msg.say('Nope!');
					incorrect.push(choice);
					points++;
				}
			}
			this.playing.delete(msg.channel.id);
			if (word.length === confirmation.length) return msg.say(`You won, it was ${word}!`);
			return msg.say(`Too bad... It was ${word}...`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
