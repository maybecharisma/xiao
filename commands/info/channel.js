const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const types = {
	dm: 'DM',
	group: 'Group DM',
	text: 'Text Channel',
	voice: 'Voice Channel',
	category: 'Category',
	unknown: 'Unknown'
};

module.exports = class ChannelInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'channel-info',
			aliases: ['channel'],
			group: 'info',
			memberName: 'channel',
			description: 'Responds with detailed information on a channel.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'channel',
					prompt: 'Which channel would you like to get information on?',
					type: 'channel',
					default: msg => msg.channel
				}
			]
		});
	}

	run(msg, { channel }) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.addField('❯ Name',
				channel.name || 'None', true)
			.addField('❯ ID',
				channel.id, true)
			.addField('❯ NSFW',
				channel.nsfw ? 'Yes' : 'No', true)
			.addField('❯ Category',
				channel.parent ? channel.parent.name : 'None', true)
			.addField('❯ Type',
				types[channel.type], true)
			.addField('❯ Creation Date',
				channel.createdAt.toDateString(), true)
			.addField('❯ Topic',
				channel.topic || 'None');
		return msg.embed(embed);
	}
};
