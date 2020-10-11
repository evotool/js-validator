# @evojs/validator

Strict nodejs validator

![@evojs/validator npm version](https://img.shields.io/npm/v/@evojs/validator.svg) ![supported node version for @evojs/validator](https://img.shields.io/node/v/@evojs/validator.svg) ![total npm downloads for @evojs/validator](https://img.shields.io/npm/dt/@evojs/validator.svg) ![monthly npm downloads for @evojs/validator](https://img.shields.io/npm/dm/@evojs/validator.svg) ![npm licence for @evojs/validator](https://img.shields.io/npm/l/@evojs/validator.svg)

## Usage example

```typescript
import { validate } from '@evojs/validator';

let profile = {
  id: 'cb0a46ea-15a7-4960-b572-ac396ed70a2c',
  firstname: 'Albert',
  lastname: 'Einstein',
  gender: 'male',
  birthdate: '1879-03-14',
};

const GUID_MASK = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/g;
const DATE_MASK = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g;

const PROFILE_RULE = {
  type: 'object',
  schema: {
    id: { type: 'string', pattern: GUID_MASK },
    firstname: { type: 'string', min: 1, trim: true },
    lastname: { type: 'string', min: 1, trim: true },
    gender: { type: 'string', values: ['male', 'female'], optional: true },
    birthdate: {
      type: 'string',
      pattern: DATE_MASK,
      parse: (x: string) => {
        const [year, month, day] = x.split('-').map(Number);
        return { year, month, day };
      },
      default: null,
    },
  },
};

try {
  profile = validate(profile, PROFILE_RULE);

  console.log(profile);

  /*
  Output:
  {
    id: 'cb0a46ea-15a7-4960-b572-ac396ed70a2c',
    firstname: 'Albert',
    lastname: 'Einstein',
    gender: 'male',
    birthdate: { year: 1879, month: 3, day: 14 },
  }
  */
} catch (err) {
  console.error(`Oh no, something went wrong...`, err);
}
```

## License

Licensed under MIT license
