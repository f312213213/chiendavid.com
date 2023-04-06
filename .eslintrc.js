module.exports = {
  extends: ['dcard/base', "next/core-web-vitals"],

  overrides: [
    {
      files: ['*.tsx'],
      extends: ['dcard/react'],
    },
  ]
}