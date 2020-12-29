const { writeFileSync, readFileSync, copyFileSync } = require('fs');
const { sync } = require('glob');
const { resolve } = require('path');

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')).toString());

delete packageJson.scripts;
delete packageJson.jest;
delete packageJson.nodemonConfig;
delete packageJson.devDependencies;

writeFileSync(resolve(__dirname, '../dist/package.json'), JSON.stringify(packageJson, null, '\t'));

const jsTsFiles = sync(resolve(__dirname, '../dist/**/*.{js,ts}'));

for (const f of jsTsFiles) {
	writeFileSync(f, readFileSync(f, 'utf-8').replace(/ {4}/g, '\t'));
}

const copyingFiles = ['LICENSE', 'README.md'];

for (const cf of copyingFiles) {
	copyFileSync(resolve(__dirname, `../${cf}`), resolve(__dirname, `../dist/${cf}`));
}
