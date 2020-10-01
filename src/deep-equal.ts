import { deepStrictEqual } from 'assert';

export function deepEqual<T extends any>(a: any, b: T): a is T {
	try {
		deepStrictEqual(a, b);

		return true;
	} catch (err) {
		return false;
	}
}
