#!/usr/bin/env node
const eslintConfig = require('eslint/conf/eslint.json');
const mctepConfig = require('..');
const { Console } = require('console');
const logger = new Console(process.stdout, process.stderr);
const checkRules = require('../src/check-rules');

try {
	checkRules(
		Object.keys(eslintConfig.rules),
		Object.keys(mctepConfig.rules)
	);
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
