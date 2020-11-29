const { writeFileSync, readFileSync, copyFileSync } = require('fs');
const { resolve } = require('path');

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')).toString());

delete packageJson.scripts;
delete packageJson.jest;
delete packageJson.nodemonConfig;
delete packageJson.devDependencies;

writeFileSync(resolve(__dirname, '../dist/package.json'), JSON.stringify(packageJson, null, 2));

const copyingFiles = ['LICENSE', 'README.md'];

for (const cf of copyingFiles) {
	copyFileSync(resolve(__dirname, `../${cf}`), resolve(__dirname, `../dist/${cf}`));
}
