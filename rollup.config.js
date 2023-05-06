// rollup.config.js
import terser from '@rollup/plugin-terser';

export default {
	input: 'assets/app.js',
	output: [
		{
			file: 'app.min.js',
			name: 'version',
			plugins: [terser()]
		},
	],
};