module.exports = {
	parser: 'babel-eslint',
	plugins: ['eslint-plugin-react', 'react-native', 'babel'],
	env: {
		es6: true,
		node: true,
		browser: true,
		'react-native/react-native': true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
		},
		sourceType: 'module',
		allowImportExportEverywhere: false,
		codeFrame: false,
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'react/jsx-uses-react': 1,
		'react/jsx-uses-vars': 1,
		'react-native/no-unused-styles': 2,
		'react-native/split-platform-components': 2,
		'react-native/no-inline-styles': 'off',
		'react/prop-types': 'off',
		'react/display-name': 'off',
	},
}
