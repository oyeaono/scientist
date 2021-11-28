module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
    splash: {
      entry: "src/renderer/splash/main.js",
      template: "public/index.html",
      filename: "splash.html",
    },
    invitationCode: {
      entry: "src/renderer/invitation-code/main.js",
      template: "public/index.html",
      filename: "invitation-code.html",
    },
  },
  lintOnSave: false,
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
    electronBuilder: {
      preload: "src/preload.js",
    },
  },
  transpileDependencies: ["quasar"],
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
};
