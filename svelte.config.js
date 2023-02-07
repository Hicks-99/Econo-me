import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import json from '@rollup/plugin-json';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
    preprocess: vitePreprocess(),
    plugins: [
        json({
            compact: true
        })
    ]
};

export default config;
