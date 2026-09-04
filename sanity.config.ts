import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './sanity/schemaTypes';

function cleanEnv(val: string | undefined): string | undefined {
  if (!val) return val;
  return val.split('\n')[0].trim();
}

export default defineConfig({
  name: 'default',
  title: 'Nilceia Studio',
  projectId: 'qf5spdw9',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
});
