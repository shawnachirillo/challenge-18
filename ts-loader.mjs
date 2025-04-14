import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'module';
import { register } from 'ts-node';

const require = createRequire(import.meta.url);
const tsConfig = resolve('./tsconfig.server.json');

register({
  project: tsConfig,
  transpileOnly: true,
  require,
});

export { load, resolve as resolveHook } from 'ts-node/esm';
