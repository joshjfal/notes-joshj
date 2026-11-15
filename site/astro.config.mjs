// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';
import { readdirSync, readFileSync } from 'node:fs';

const contentDir = new URL('../content/', import.meta.url);
const isLive = process.env.NODE_ENV === 'production';

function readFront(url) {
	const front = readFileSync(url, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	return {
		title: front.match(/^title:\s*(.+)$/m)?.[1]?.trim(),
		order: Number(front.match(/^\s+order:\s*(\d+)/m)?.[1] ?? 999),
		draft: /^draft:\s*true/m.test(front),
	};
}

function sections() {
	return readdirSync(contentDir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && !/^[_.]/.test(d.name))
		.map(({ name: dir }) => {
			const files = readdirSync(new URL(`${dir}/`, contentDir));
			const indexFile = files.find((f) => /^index\.mdx?$/.test(f));
			const index = indexFile ? readFront(new URL(`${dir}/${indexFile}`, contentDir)) : undefined;
			const pages = files
				.filter((f) => /\.mdx?$/.test(f) && !/^[_.]/.test(f) && f !== indexFile)
				.map((f) => ({ slug: `${dir}/${f.replace(/\.mdx?$/, '')}`, ...readFront(new URL(`${dir}/${f}`, contentDir)) }))
				.filter((p) => !(isLive && p.draft))
				.sort((a, b) => a.order - b.order || (a.title ?? a.slug).localeCompare(b.title ?? b.slug));
			return {
				label: index?.title ?? dir.charAt(0).toUpperCase() + dir.slice(1),
				order: index?.order ?? 999,
				items: [...(indexFile ? [{ slug: dir, label: 'Overview' }] : []), ...pages.map((p) => p.slug)],
			};
		})
		.filter((s) => s.items.length > 0)
		.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
		.map(({ label, items }) => ({ label, items }));
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
			sidebar: sections(),
		}),
	],
});
