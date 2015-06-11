// regA ��-append��-after
// regP ��-prepend��-before
// reg  ��-replace
module.exports = {
	head: {
		regA: /<head>/g,
		regP: /<\/head>/g
	},
	body: {
		regA: /<body>/g,
		regP: /<\/body>/g
	},
	html: {
		regA: /<html>/g,
		regP: /<\/html>/g
	},
	icon: {
		reg: /<link.+icon[^>]+>/g
	}
};