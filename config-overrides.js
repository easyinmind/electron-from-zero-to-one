const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        hack: `true; @import "${require("path").resolve(
          __dirname,
          "./src/styles/theme.less"
        )}";`,
      },
    },
  })
);
