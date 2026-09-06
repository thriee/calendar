import vue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const tsRules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'vue/multi-word-component-names': 'off',
  // Formatting is delegated to Prettier (`pnpm format`); these vue formatting
  // rules from the flat/recommended preset conflict with Prettier output and
  // only surfaced once the parser defect (below) was fixed.
  'vue/attributes-order': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/singleline-html-element-content-newline': 'off'
};

export default [
  { ignores: ['dist/**', 'node_modules/**', 'dev-dist/**', '*.config.js'] },
  ...vue.configs['flat/recommended'],
  // Plain TypeScript files: @typescript-eslint/parser handles the whole file.
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: tsRules
  },
  // .vue files keep the vue-eslint-parser provided by eslint-plugin-vue's flat
  // config (do NOT override the top-level parser), but the <script> blocks are
  // delegated to @typescript-eslint/parser via parserOptions.parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: tsRules
  }
];
