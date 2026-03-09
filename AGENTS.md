# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

This is a **Jekyll-based personal portfolio and blog site** deployed to GitHub Pages at [RaymondTana.github.io](https://RaymondTana.github.io).

- **Static Site Generator:** Jekyll 4.4.1 (Ruby-based)
- **Theme:** Minimal Mistakes v4.26.2 (loaded via remote theme)
- **Markdown Processor:** kramdown with GFM (GitHub Flavored Markdown) parser
- **Templating:** Liquid template language
- **Deployment:** GitHub Pages (automatic on push to main)

## Build Commands

### Setup (First Time)
```bash
# Install Ruby via Homebrew (macOS)
brew install ruby

# Add to PATH in ~/.zshrc or ~/.bashrc:
# export PATH="/opt/homebrew/opt/ruby/bin:$PATH"

# Install Bundler
gem install bundler

# Install dependencies
bundle install
```

### Development
```bash
# Serve site locally at http://localhost:4000
bundle exec jekyll serve

# Serve with draft posts visible
bundle exec jekyll serve --drafts

# Build site to _site/ directory
bundle exec jekyll build

# List installed gems
bundle list
```

**Important:** Delete `Gemfile.lock` if encountering dependency errors. Never use `sudo` for gem installation.

### Testing
❌ **No automated testing framework configured.** This is a content-focused static site.

## Project Structure

```
/
├── _config.yml           # Main Jekyll configuration
├── _data/                # Data files (navigation.yml)
├── _drafts/              # Draft blog posts (gitignored)
├── _includes/            # Reusable HTML partials (49 files)
├── _layouts/             # Page layout templates (14 files)
├── _posts/               # Published blog posts (YYYY-MM-DD-title.md format)
├── _sass/                # SASS/SCSS stylesheets
├── _site/                # Generated static site (gitignored)
├── about/                # About page
├── blog/                 # Blog listing page
├── cv/                   # CV page
├── math/                 # Math-related content
├── projects/             # Project showcase pages
├── teaching/             # Teaching portfolio
└── my_assets/            # Custom assets (CSS, JS, images, etc.)
```

## Code Style Guidelines

### Markdown Files (Content)

**File Naming:**
- Blog posts: `_posts/YYYY-MM-DD-title-in-kebab-case.md`
- Pages: `directory/index.md` or `directory/page-name.md`

**Front Matter (Required for all pages):**
```yaml
---
title: "Page Title"
date: YYYY-MM-DD
categories:
  - Category1
  - Category2
tags:
  - tag1
  - tag2
header:
  og_image: /my_assets/images/image.jpg
  teaser: /my_assets/images/teaser.jpg
---
```

**Markdown Syntax:**
- Use GitHub Flavored Markdown (GFM)
- Code blocks: Use triple backticks with language specifier
- Math: Use LaTeX syntax with `$$` for display math, `$` for inline (if MathJax enabled)
- Links: Use relative paths for internal links: `[text](/path/to/page/)`

### HTML (Layouts & Includes)

**Liquid Templating:**
- Use Liquid syntax for conditionals: `{% if condition %}...{% endif %}`
- Variables: `{{ site.title }}`, `{{ page.title }}`, `{{ content }}`
- Includes: `{% include filename.html %}`
- Loops: `{% for item in collection %}...{% endfor %}`
- Comments: `{%- comment %} comment text {% endcomment -%}`

**File Organization:**
- Layouts inherit from other layouts: `layout: default` in front matter
- Keep partials small and focused in `_includes/`
- Use semantic HTML5 elements (`<article>`, `<section>`, `<nav>`, etc.)

### CSS/SCSS

**File Location:**
- Custom global styles: `my_assets/css/custom.css`
- Page-specific styles: `my_assets/css/PageName.css`
- Theme overrides: `_sass/` directory

**Style Conventions:**
```css
/* Use descriptive class names */
.video-container { }
.page__content { }

/* Mobile-first responsive design */
@media (max-width: 768px) {
  /* Mobile overrides */
}

/* Prefer specific selectors over !important */
/* Use !important only when overriding theme styles */
.layout--single .page {
  margin-left: auto !important;  /* Override theme */
}
```

### JavaScript

**File Location:** `my_assets/js/`

**Style Conventions:**
```javascript
// Use ES6+ modern JavaScript
class Vec2 {
  constructor(x = 0, y = 0) { 
    this.x = x; 
    this.y = y; 
  }
  add(v) { 
    this.x += v.x; 
    this.y += v.y; 
    return this; 
  }
}

// Use descriptive variable names
const svgPath_R_outer = `...`;
const totalLength = ordered.reduce((sum, loop) => sum + loop.length, 0);

// Add comments for complex logic
/*** 
 * This script creates the "RT" logo
 * Mathematically, it is equivalent to an epicycle drawing
 * The circles' radii and phases are decided using the discrete Fourier transform
 ***/

// Use const/let, never var
const canvas = document.getElementById('canvas');
let currentFrame = 0;

// Prefer arrow functions for callbacks
loops.sort((a, b) => a.length - b.length);
```

**Naming Conventions:**
- Functions: `camelCase` - `samplerFromPath()`, `memoryPrintout()`
- Classes: `PascalCase` - `Vec2`, `FractalRenderer`
- Constants: `camelCase` or `SCREAMING_SNAKE_CASE` for true constants
- Private methods: Prefix with underscore `_privateMethod()`

### Configuration Files

**_config.yml:**
- Use lowercase keys with underscores: `author_profile: true`
- Organize related settings with comments
- Keep site-wide settings here, not in individual pages

**Gemfile:**
- Group Jekyll plugins: `group :jekyll_plugins do ... end`
- Pin major versions: `gem "jekyll", "~> 4.3"`
- Comment compatibility requirements: `# Required for Ruby 3.4+ compatibility`

## Content Guidelines

### Blog Posts
- Place in `_posts/` with proper naming: `YYYY-MM-DD-title.md`
- Include required front matter (title, date, categories, tags)
- Add Open Graph image for social sharing: `header.og_image`
- Use descriptive titles and excerpts for SEO

### Images & Assets
- Store in `my_assets/images/`
- Use web-optimized formats (WebP preferred, fallback to JPEG/PNG)
- Include alt text in markdown: `![Alt text](/path/to/image.jpg)`
- Reference with absolute paths: `/my_assets/images/file.jpg`

### Links
- Internal links: Use relative paths `/blog/` or `/projects/`
- External links: Use full URLs with `https://`
- Open external links in new tab if needed via HTML: `<a href="..." target="_blank">`

## Git Workflow

**Gitignored Files:**
- `_drafts/` - Work-in-progress posts
- `_site/` - Generated site output
- `.jekyll-cache/`, `.sass-cache/`
- `.bundle/`, `*.gem`
- `.DS_Store` (macOS)

**Commit Messages:**
- Use imperative mood: "Add blog post" not "Added blog post"
- Be descriptive: "Update CV with new position at Butter"
- Reference context: "Fix responsive layout on mobile devices"

## Deployment

This site deploys automatically via GitHub Pages when changes are pushed to the `main` branch. No manual build or deployment steps required.

**Important:** GitHub Pages has specific gem version constraints. Test locally before pushing.

## Common Tasks

**Add a new blog post:**
1. Create `_posts/YYYY-MM-DD-title.md` with front matter
2. Write content in Markdown
3. Test locally: `bundle exec jekyll serve --drafts`
4. Commit and push to deploy

**Add a new project page:**
1. Create `projects/project-name/index.md`
2. Add front matter with title, images, description
3. Update navigation in `_data/navigation.yml` if needed
4. Add assets to `my_assets/`

**Customize theme:**
1. Override theme files by copying to local `_layouts/` or `_includes/`
2. Add custom CSS to `my_assets/css/custom.css`
3. Reference custom CSS in `_config.yml`: `custom_css: my_assets/css/custom.css`

**Test before deploying:**
Always run `bundle exec jekyll serve` locally to verify changes before pushing.
