#!/usr/bin/env node
const { Console } = require('console');
const importsPluginConfig = require('eslint-plugin-import');
const eslintConfig = require('eslint/conf/eslint-all');
const mctepConfig = require('..');

const logger = new Console(process.stdout, process.stderr);

try {
	checkConfig(
		eslintConfig,
		mctepConfig,
		{ import: importsPluginConfig }
	);
} catch (error) {
	logErrorRules('There are missing rules:', error.missing);
	logErrorRules('There are deprecated rules:', error.deprecated);
	throw error;
}

function logErrorRules(title, rules) {
	if (Array.isArray(rules) && rules.length) {
		logger.error(title);
		rules.sort().forEach((rule) => {
			logger.error(` * ${rule}`);
		});
	}
}

function checkConfig(baseConfig, customConfig, pluginConfigs) {
	const baseRules = Object.keys(baseConfig.rules);
	const customRules = Object.keys(customConfig.rules);

	Object.keys(pluginConfigs).forEach((plugin) => {
		Object.keys(pluginConfigs[plugin].rules)
			.forEach((rule) => {
				baseRules.push(`${plugin}/${rule}`);
			});
	});

	return checkRules(baseRules, customRules);
}

function checkRules(base, custom) {
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
}
