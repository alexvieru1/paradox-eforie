import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** Flat ESLint config built on the project's eslint-config-next dependency. */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "dist/**", ".superpowers/**"] },
  ...next,
  ...nextTypescript,
];

export default eslintConfig;
