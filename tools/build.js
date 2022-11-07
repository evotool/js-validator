'use strict';

const { writeFileSync, readFileSync, copyFileSync } = require('fs');
const { sync } = require('glob');
const { resolve } = require('path');

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')).toString());

delete packageJson.scripts;
delete packageJson.jest;
delete packageJson.devDependencies;

copyFileSync(resolve(__dirname, '../README.md'), resolve(__dirname, '../dist/README.md'));
writeFileSync(resolve(__dirname, '../dist/package.json'), JSON.stringify(packageJson, null, '\t'));

const jsTsFiles = sync(resolve(__dirname, '../dist/**/*.{js,ts}'));

for (const f of jsTsFiles) {
  writeFileSync(f, readFileSync(f, 'utf-8').replace(/ {4}/g, '\t'));
}
