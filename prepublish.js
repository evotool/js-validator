if (process.env.RELEASE_MODE !== '1') {
	throw new Error('Run `npm run release` to publish the package');
}

const { existsSync, unlinkSync } = require('fs');

if (existsSync('dist/tsconfig.tsbuildinfo')) {
	unlinkSync('dist/tsconfig.tsbuildinfo');
}
