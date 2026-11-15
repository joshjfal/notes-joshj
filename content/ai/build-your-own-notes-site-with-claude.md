---
title: Build your own notes site (GitHub Pages) with Claude
description: How to get Claude to create a markdown notes site like this one, hosted free on GitHub Pages under your own domain.
date: 2026-11-15
sidebar:
  order: 10
---

I’ve been meaning to find somewhere to keep my notes from learning Azure and AI. I didn’t want to run a CMS or look after hosting, just something simple I could keep adding to.

I already use GitHub and had heard of people running sites from it, so that’s where I started. It turns out the site doesn’t actually run from GitHub. The repo holds the files, and a build step turns them into the website that GitHub Pages hosts.

I write my notes in markdown, so I wanted the site built directly from those files. No copying and pasting every small change into an editor, and everything version controlled in GitHub.

Rather than build it by hand, I handed the job to Claude. Using Claude in Chrome and computer use, it built the site, created the repo, set up the DNS and published it.

This guide shows how to do the same for your own domain.

You can paste the prompts below into Claude yourself, or point Claude Code at this page and ask it to follow and build.

## What you get

- Articles written as markdown files in a public GitHub repo
- A clean, searchable docs-style site with light and dark modes
- Free hosting on GitHub Pages, on your own subdomain, with HTTPS
- Automatic publishing every time you push
- Dependency updates that test, merge and deploy themselves
- No server, no CMS, no running cost

## Prerequisites

- A GitHub account, signed in
- A domain name, signed in to the registrar or DNS provider
- [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download) on your machine (Node.js optional)
- The Claude desktop app with Claude in Chrome, a connected folder and computer use

## How it works

- Your markdown files are the source of truth
- On every push, GitHub builds them into a website and publishes it
- The menu is generated from your folder structure, so a new folder becomes a new section
- Your DNS points a subdomain at GitHub, and GitHub issues the HTTPS certificate for it

## Before you start

- Keep drafts in a separate private repo. In a public repo, every branch and old commit can be read, including anything you later delete.
- Use a subdomain such as `notes.` so your main domain stays free for something else.
- Keep the publishing repo public. GitHub Pages from a private repo needs a paid plan.

## Step 1 - Ask Claude to build it

Fill in the details and send this as one prompt:

```text
Build me a technical notes site, published on GitHub Pages under my own domain.

My details:
- GitHub username: <your-github-username>
- New public repo name: <repo-name>
- Site address: <subdomain>.<your-domain>
- DNS provider: <your-dns-provider>
- Site title: <site-title>
- Sections: <section-1>, <section-2> (for example Azure, AI)
- Save the project to: <local-folder>

How I want it:
- Use Astro Starlight for the site
- I write articles as markdown files. Keep them in their own folder at the top of the repo, with the site code in a separate folder, so anyone browsing the repo sees the articles first
- Give me a homepage, a page for each section and an article template I can copy
- Publish automatically with GitHub Actions whenever I push to main
- Test-build every pull request without publishing it
- Set up Dependabot to check for updates monthly. If an update passes the test build, merge it and redeploy the site automatically, but leave major version upgrades for me to review
- Keep code comments and the README minimal

Setup:
- I'm signed in to GitHub and <your-dns-provider> in the browser
- Create the repo, point the subdomain at it, and verify my domain on GitHub
- Check my existing DNS records before adding anything, and don't change them
- Make sure the site builds before you push anything
- Once GitHub has issued the HTTPS certificate, turn on Enforce HTTPS
- Confirm the site is live on my domain when you're done
```

What Claude does:

- Builds the site, sections, homepage and article template, and checks it builds
- Creates the GitHub repo and sets it to publish through GitHub Actions
- Adds the DNS record that points your subdomain at GitHub, and verifies your domain
- Saves the project to your folder, commits it and pushes it
- Checks the first deploy and confirms the site loads on your domain

How it's controlled:

- You approve access to the folder, the browser and any apps before Claude uses them
- GitHub and DNS changes are made in your own browser, under your existing sign-ins
- Claude test-builds the site in its own workspace before pushing anything
- If Claude can't use your Git sign-in, it will either ask you to run `git push` or run it on your machine with computer use

What you do:

- Approve access when prompted
- Run `git push` once yourself, if asked (or tell Claude to do it using computer use)
- Ask Claude to turn on Enforce HTTPS later, if the certificate wasn't ready during the build

## What gets set up

### Your domain

- Claude adds a CNAME record at your DNS provider, pointing your subdomain at GitHub. This is what sends visitors to your site.
- It also verifies your domain on your GitHub account, using a TXT record. This stops anyone else attaching your domain, or any of its subdomains, to their own GitHub site.
- Your existing records are left alone.
- DNS changes can take anywhere from a few minutes to a few hours to be seen everywhere. If verification doesn't pass straight away, ask Claude to try again later.

### HTTPS

- You don't buy or install a certificate. Once GitHub sees your DNS pointing at it, it requests a free one from Let's Encrypt, installs it and renews it for you.
- Until then, the site may only load over `http://`.
- Enforce HTTPS is a single setting in the repo's Pages settings. It redirects anyone on `http://` to the secure version. It can only be turned on once the certificate exists.

### Publishing

- A GitHub Actions workflow runs on every push to main. It builds your markdown into a website and publishes it to GitHub Pages.
- A second check test-builds every pull request without publishing it, so a broken update is caught before it goes live.
- If a build fails, the live site stays on the last good version.

### Dependabot

- Dependabot is built into GitHub. Claude switches it on by adding a small config file to the repo, so there's nothing to install.
- Once a month, it checks whether the site's packages or the GitHub Actions it uses have newer versions.
- For each update, it opens a pull request, which triggers the test build.

### Auto-merge

- When a Dependabot pull request passes its test build, it merges itself and the site redeploys.
- Major version upgrades are the exception. They stay open for you to review, because they're the ones most likely to need a change.
- In practice, you only hear about updates when one needs a decision or fails its test build.

## Step 2 - Pick a theme

Ask for options:

```text
Show me community themes for Starlight that suit a technical notes site, with a shortlist.
```

Then apply the one you like:

```text
Apply the <theme-name> theme, check the site still builds, and push it.
```

- This site uses the [Nova theme](https://starlight-theme-nova.pages.dev)
- Themes don't touch your articles, so you can change your mind later
- The full list is on the [Starlight themes page](https://starlight.astro.build/resources/themes/)

## Step 3 - Publish articles

- Copy the article template into a section folder and rename it. The file name becomes the page address.
- Fill in the title and the one-line description at the top.
- Push to main. The site updates in about a minute.
- Files whose names start with an underscore, like the template, are never published.

## Preview articles locally

If you want to see your articles on your own machine before publishing them to GitHub, install [Node.js](https://nodejs.org/en/download) and run:

```text
cd <local-folder>/site
npm install
npm run dev
```

- Open `http://localhost:4321` in your browser to view the site
- Changes to your articles show up as soon as you save them
- Press Ctrl+C in the terminal to stop it
- You only need `npm install` the first time

If you don't want to preview locally, you can skip installing Node.js.

## Running costs and upkeep

- GitHub Pages, Actions and Dependabot are free for public repos
- The HTTPS certificate is free and renews itself
- The only regular task is reviewing the occasional major upgrade
- GitHub emails you if a build fails
