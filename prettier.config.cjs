/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  importOrder: [
    "^@/core/(.*)$",
    "^@/server/(.*)$",
    "^@/types/(.*)$",
    "^@/ui/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
