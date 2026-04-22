// Silence Winston / console noise during tests so snapshots and reports stay readable.
// Individual tests can still spy on console if needed.
const noop = () => undefined;

/* eslint-disable no-console */
console.log = noop;
console.info = noop;
console.warn = noop;
console.error = noop;
/* eslint-enable no-console */

process.env.NODE_ENV = 'test';
