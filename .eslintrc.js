module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: [
    'babel',
    'standard',
    'vue'
  ],
  extends: [
    'standard'
  ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'array-bracket-spacing': 2,
    'babel/object-curly-spacing': 2,
    'computed-property-spacing': 2,
    'eol-last': 2,
    'generator-star-spacing': 2,
    'max-depth': 2,
    'max-len': [
      2,
      120,
      2
    ],
    'max-nested-callbacks': 2,
    'max-params': [2, 5],
    'prefer-promise-reject-errors': 0,
    'standard/no-callback-literal': 0,
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    'object-curly-spacing': 0
  }
}
