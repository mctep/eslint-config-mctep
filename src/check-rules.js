module.exports = function checkRules(base, custom) {
	const missing = base.filter((name) => {
		return !custom.includes(name);
	});

	const deprecated = custom.filter((name) => {
		return !base.includes(name);
	});

	if (!missing.length && !deprecated.length) {
		return;
	}

	const error = new Error('There are problems in rules');

	Object.assign(error, { deprecated, missing });
	throw error;
};
