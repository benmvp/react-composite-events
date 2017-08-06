#!/usr/bin/env bash

# Globally install semantic-release package for releasing
yarn global add semantic-release

# 1. Update package.json version number based on commits
# 2. Publish new version to NPM
# 3. Generate changelog + release on Github
semantic-release pre && npm publish && semantic-release post
