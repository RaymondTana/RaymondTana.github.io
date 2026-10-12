# My Site

Visit [RaymondTana.github.io](https://RaymondTana.github.io) to see all of my projects and experiences, as well as to find my CV.

## Implementation

This site uses the `github-pages` gem, which bundles Jekyll with a markdown processor called kramdown with the GFM parser. Effectively, this builds a site from a bunch of static Markdown scripts. The site's theme is Minimal Mistakes v4.26.2, which styles the generated HTML. 

### To serve locally:

1. Install Ruby via Homebrew

```bash
brew install ruby
```

2. Add Homebrew Ruby (and its gem executables) to PATH, and use a UTF-8 locale (`~/.zshrc` or `~/.bashrc`):
```bash
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"
export LANG=en_US.UTF-8   # without this, Jekyll crashes on non-ASCII filenames
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
bundle exec jekyll serve --livereload
```
And visit `http://localhost:4000`.

This clone is a blobless, sparse checkout, so `my_assets/audio/` is not on disk
(`git sparse-checkout list` shows the patterns). Audio won't play locally, but
everything else builds.

(Many common errors can be avoided by deleting the existing `Gemfile.lock` and not using `sudo`).

To see draft posts, you can add the `--drafts` flag to the end of the serve command.