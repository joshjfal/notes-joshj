// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';
import { readdirSync, readFileSync } from 'node:fs';

const contentDir = new URL('../content/', import.meta.url);

function section(label, dir) {
	const entries = readdirSync(new URL(`${dir}/`, contentDir))
		.filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_') && !f.startsWith('index.'))
		.map((f) => {
			const text = readFileSync(new URL(`${dir}/${f}`, contentDir), 'utf-8');
			const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
			return {
				slug: `${dir}/${f.replace(/\.mdx?$/, '')}`,
				title: front.match(/^title:\s*(.+)$/m)?.[1] ?? f,
				order: Number(front.match(/^\s+order:\s*(\d+)/m)?.[1] ?? 999),
				draft: /^draft:\s*true/m.test(front),
			};
		})
		.filter((e) => !e.draft || process.env.NODE_ENV !== 'production')
		.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
	return { label, items: [{ slug: dir, label: 'Overview' }, ...entries.map((e) => e.slug)] };
}

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
			sidebar: [section('Azure', 'azure'), section('AI', 'ai')],
		}),
	],
});
