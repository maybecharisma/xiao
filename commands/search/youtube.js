const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class YouTubeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['youtube-video'],
			group: 'search',
			memberName: 'youtube',
			description: 'Searches YouTube for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What video would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://www.googleapis.com/youtube/v3/search')
				.query({
					part: 'snippet',
					type: 'video',
					maxResults: 1,
					q: query,
					key: GOOGLE_KEY
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xDD2825)
				.setTitle(data.snippet.title)
				.setDescription(data.snippet.description)
				.setAuthor('YouTube', 'https://i.imgur.com/kKHJg9Q.png', 'https://www.youtube.com/')
				.setURL(`https://www.youtube.com/watch?v=${data.id.videoId}`)
				.setThumbnail(data.snippet.thumbnails.default ? data.snippet.thumbnails.default.url : null)
				.addField('❯ ID',
					data.id.videoId, true)
				.addField('❯ Publish Date',
					new Date(data.snippet.publishedAt).toDateString(), true)
				.addField('❯ Channel',
					data.snippet.channelTitle, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
