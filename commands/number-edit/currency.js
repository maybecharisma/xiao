const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { list } = require('../../util/Util');
const codes = require('../../assets/json/currency');

module.exports = class CurrencyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			aliases: ['currency-convert', 'convert-currency'],
			group: 'number-edit',
			memberName: 'currency',
			description: 'Converts money from one currency to another.',
			details: `**Codes**: ${codes.join(', ')}`,
			args: [
				{
					key: 'base',
					prompt: `What currency code do you want to use as the base? Either ${list(codes, 'or')}.`,
					type: 'string',
					validate: base => {
						if (codes.includes(base.toUpperCase())) return true;
						return `Invalid base, please enter either ${list(codes, 'or')}.`;
					},
					parse: base => base.toUpperCase()
				},
				{
					key: 'target',
					prompt: `What currency code do you want to convert to? Either ${list(codes, 'or')}.`,
					type: 'string',
					validate: target => {
						if (codes.includes(target.toUpperCase())) return true;
						return `Invalid target, please enter either ${list(codes, 'or')}.`;
					},
					parse: target => target.toUpperCase()
				},
				{
					key: 'amount',
					prompt: 'How much money should be converted? Do not use symbols.',
					type: 'float'
				}
			]
		});
	}

	async run(msg, { base, target, amount }) {
		if (base === target) return msg.say(`Converting ${base} to ${target} is the same value, dummy.`);
		try {
			const { body } = await snekfetch
				.get('http://api.fixer.io/latest')
				.query({
					base,
					symbols: target
				});
			return msg.say(`${amount} ${base} is ${amount * body.rates[target]} ${target}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
