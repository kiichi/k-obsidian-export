import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules'

const banner =
`/*
THIS IS FOR STAND-ALONE EXPORT RUNNER WITHOUT INSTALLING THIS PLUGIN
K Website Export
*/
`;

esbuild.build({
	banner: {
		js: banner,
	},
	entryPoints: ['stand-alone.ts'],
	bundle: true,
	external: [		
		...builtins],
	format: 'cjs',
	watch: false,
	target: 'es2018',
	logLevel: "info",
	sourcemap: 'inline',
	treeShaking: true,
	outfile: 'stand-alone.js',
}).catch(() => process.exit(1));
