const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class DerpibooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'derpibooru',
			aliases: ['my-little-pony-image', 'mlp-image'],
			group: 'search',
			memberName: 'derpibooru',
			description: 'Searches Derpibooru for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await snekfetch
				.get('https://derpibooru.org/search.json')
				.query({
					q: query,
					random_image: 1
				});
			if (!search.body) return msg.say('Could not find any results.');
			const { body } = await snekfetch
				.get(`https://derpibooru.org/images/${search.body.id}.json`);
			if (!msg.channel.nsfw && body.tags.includes('suggestive')) {
				return msg.say('This image is only viewable in NSFW channels.');
			}
			return msg.say(`https:${body.representations.large}`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
