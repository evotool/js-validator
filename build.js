const { writeFileSync, readFileSync, copyFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('package.json').toString());

delete packageJson.scripts;

writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

const copyingFiles = ['LICENSE', 'README.md'];

for (const cf of copyingFiles) {
	copyFileSync(cf, `dist/${cf}`);
}
