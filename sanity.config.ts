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
  projectId: cleanEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) as string,
  dataset: cleanEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
});
