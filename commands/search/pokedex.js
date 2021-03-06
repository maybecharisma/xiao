const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { filterPkmn } = require('../../util/Util');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex',
			aliases: ['pokemon', 'pokémon', 'pokédex'],
			group: 'search',
			memberName: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to get information on?',
					type: 'string',
					parse: pokemon => encodeURIComponent(pokemon.toLowerCase().replace(/ /g, '-'))
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
			const id = body.id.toString().padStart(3, '0');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(
					`#${id} - ${filterPkmn(body.names).name}`,
					`https://www.serebii.net/pokedex-sm/icon/${id}.png`,
					`https://www.serebii.net/pokedex-sm/${id}.shtml`
				)
				.setDescription(stripIndents`
					**The ${filterPkmn(body.genera).genus}**
					${filterPkmn(body.flavor_text_entries).flavor_text.replace(/\n|\f|\r/g, ' ')}
				`)
				.setThumbnail(`https://www.serebii.net/sunmoon/pokemon/${id}.png`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
