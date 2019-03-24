const babelPresetEnvOpts = {
	loose              : true,
	forceAllTransforms : true,
	targets            : {
		browsers : [ 'last 2 versions' ],
		node     : 'current'
	}
}

module.exports = {
	presets : [
		['@babel/preset-env', babelPresetEnvOpts]
	],
	plugins : [
		['@babel/plugin-proposal-class-properties', {loose : true}],
		['@babel/plugin-proposal-object-rest-spread']
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
