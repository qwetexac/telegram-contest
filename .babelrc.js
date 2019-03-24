const babelPresetEnvOpts = {
	loose              : true,
	// useBuiltIns        : 'usage',
	forceAllTransforms : true,
	targets            : {
		browsers : [
			'last 2 chrome versions',
			'ios_saf >= 6'
			// 'safari versions'
		],
		node     : 'current'
	}
}

module.exports = {
	presets : [
		['@babel/preset-react'],
		['@babel/preset-env', babelPresetEnvOpts]
	],
	plugins : [
		['@babel/plugin-proposal-decorators', {legacy : true, decoratorsLegacy : true}],
		['@babel/plugin-proposal-class-properties', {loose : true}],
		['@babel/plugin-proposal-object-rest-spread'],
		['@babel/plugin-transform-runtime', {helpers : false}]
	],
	
	env : {
		development : {
			presets : [
				['@babel/preset-env', {
					...babelPresetEnvOpts,
					debug : true
				}]
			]
		},
		production  : {
			presets : [
				['@babel/preset-env', {
					...babelPresetEnvOpts
				}]
			],
		}
	}
}
