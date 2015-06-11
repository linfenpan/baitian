// regA 是-append和-after
// regP 是-prepend和-before
// reg  是-replace
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