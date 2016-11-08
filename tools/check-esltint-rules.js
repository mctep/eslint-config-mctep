#!/usr/bin/env node
const eslintConfig = require('eslint/conf/eslint.json');
const mctepConfig = require('..');
const { Console } = require('console');
const logger = new Console(process.stdout, process.stderr);

try {
	checkConfigs(eslintConfig, mctepConfig);
} catch (error) {
	logErrorRules('There are missing rules:', error.missing);
	logErrorRules('There are deprecated rules:', error.deprecated);
	throw error;
}

function logErrorRules(title, rules) {
	if (Array.isArray(rules) && rules.length) {
		logger.error(title);
		rules.forEach((rule) => {
			logger.error(` * ${rule}`);
		});
	}
}

function checkConfigs(eslint, custom) {
	const eslintRuleNames = Object.keys(eslint.rules);
	const customRuleNames = Object.keys(custom.rules);

	const missing = eslintRuleNames.filter((name) => {
		return !customRuleNames.includes(name);
	});

	const deprecated = customRuleNames.filter((name) => {
		return !eslintRuleNames.includes(name);
	});

	if (missing.length || deprecated.length) {
		const error = new Error('There are errors in eslint config');

		Object.assign(error, { deprecated, missing });
		throw error;
	}

	return null;
}
