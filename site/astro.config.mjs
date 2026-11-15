// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';

export default defineConfig({
	site: 'https://notes.joshj.co.uk',
	integrations: [
		starlight({
			plugins: [starlightThemeNova()],
			title: 'Josh J',
			description: 'Technical notes and documentation on Azure and AI.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/joshjfal' },
			],
			lastUpdated: true,
			sidebar: [
				{ label: 'Azure', items: [{ autogenerate: { directory: 'azure' } }] },
				{ label: 'AI', items: [{ autogenerate: { directory: 'ai' } }] },
			],
		}),
	],
});
