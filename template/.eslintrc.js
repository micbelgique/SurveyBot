module.exports = {
    extends: 'standard',
    rules: {
        semi: [2, 'always'],
        indent: [2, 4],
        'no-trailing-spaces': [2, { skipBlankLines: true, ignoreComments: true }],
        'no-return-await': 0,
        'space-before-function-paren': [
            2,
            {
                named: 'never',
                anonymous: 'never',
                asyncArrow: 'always'
            }
        ],
        'template-curly-spacing': [2, 'always']
    }
};
