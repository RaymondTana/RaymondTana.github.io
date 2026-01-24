# My Site

Visit [RaymondTana.github.io](https://RaymondTana.github.io) to see all of my projects and experiences, as well as to find my CV/Résumé.

## Implementation

This site uses the `github-pages` gem, which bundles Jekyll with a markdown processor called kramdown with the GFM parser. Effectively, this builds a site from a bunch of static Markdown scripts. The site's theme is Minimal Mistakes v4.26.2, which styles the generated HTML. 

### To serve locally:

1. Install Ruby via Homebrew

```bash
brew install ruby
```

2. Add Homebrew Ruby to PATH (`~/.zshrc` or `~/.bashrc`):
```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```
And then reload your shell (e.g., `source ~/.zshrc`).

3. Install Bundler
```bash
gem install bundler
```

4. Install Dependencies
From the repo root:
```bash
bundle install
```

5. Run the Local Server
```bash
bundle exec jekyll serve
```
And visit `http://localhost:4000`.

(Many common errors can be avoided by deleting the existing `Gemfile.lock` and not using `sudo`).

To see draft posts, you can add the `--drafts` flag to the end of the serve command.