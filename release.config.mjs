/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main", "next", { name: "beta", prerelease: true }],
};
