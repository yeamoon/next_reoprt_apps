import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig ({
   test: {
		environment: 'jsdom',
      include: ['src/tests/**/*.test.ts*'],
		globals: true
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   }
});
