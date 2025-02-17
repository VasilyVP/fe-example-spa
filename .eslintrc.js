module.exports = {
  'env': {
  'browser': true,
  'es2021': true
  },
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "overrides": [
    {
      "files": [
        "**/*.stories.*"
      ],
      "rules": {
        "import/no-anonymous-default-export": "off",
      }
    },
    {
      "files": [
        "**/**"
      ],
      "rules": {
        "import/no-webpack-loader-syntax": "off",
        "import/no-anonymous-default-export": [
          "error",
          {
            "allowArray": false,
            "allowArrowFunction": true,
            "allowAnonymousClass": true,
            "allowAnonymousFunction": true,
            "allowCallExpression": true,
            "allowLiteral": true,
            "allowObject": true
          }
        ]
      }
    }
  ]
};
