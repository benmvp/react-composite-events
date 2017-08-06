#!/usr/bin/env bash

# 1. Update package.json version number based on commits
# 2. Publish new version to NPM
# 3. Generate changelog + release on Github
semantic-release pre && npm publish && semantic-release post
