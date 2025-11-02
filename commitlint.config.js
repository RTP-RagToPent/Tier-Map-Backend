module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat",
      "fix",
      "docs",
      "refactor",
      "test",
      "chore",
      "remove",
    ]],
    "header-max-length": [2, "always", 100],
    "subject-case": [0, "never"],
  },
};
