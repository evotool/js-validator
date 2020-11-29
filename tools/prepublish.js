if (process.env.RELEASE_MODE !== '1') {
	throw new Error('Run `npm run release` to publish the package');
}

const { existsSync, unlinkSync } = require('fs');
const { resolve } = require('path');

const tsbuildinfoPath = resolve(__dirname, '../dist/tsconfig.tsbuildinfo');

if (existsSync(tsbuildinfoPath)) {
	unlinkSync(tsbuildinfoPath);
}
