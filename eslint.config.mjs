import eslintConfigNext from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...eslintConfigNext,
  {
    name: "acep/dynamic-marketing-img",
    files: [
      "src/components/home/**/*.tsx",
      "src/components/shared/**/*.tsx",
      "src/components/admin/insert-from-media-button.tsx",
      "src/components/admin/media-library.tsx",
    ],
    rules: {
      // CMS thumbnails and scraped/dynamic publication imagery; paths are not static imports.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
