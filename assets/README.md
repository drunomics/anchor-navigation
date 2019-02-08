# Building assets

## Quickstart

### Build assets for production
```bash
# Install dependencies
npm install

# Builds assets for production (minified)
npm run build

# Builds unminified, sets watchers to build on source save
npm run watch
```

### NVM

You can use `nvm` to match the node version to the one
used for developing this package.

To install it globally and pick up the fersion from .nvmrc:

```bash
# Install nvm globally
npm install nvm -g

# Pick up the node version to use from .nvmrc
nvm use
```

## Features

- webpack 4
- es8: by babel, presets & plugins
- sass support: with autoprefixer
- eslint: with babel-eslint
- production & development (watch) tasks
- uglifyjs
