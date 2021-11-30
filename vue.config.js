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
    quantitativeTransaction: {
      entry: "src/renderer/quantitative-transaction/main.js",
      template: "public/index.html",
      filename: "quantitative-transaction.html",
    },
    preemptivePreSale: {
      entry: "src/renderer/preemptive-pre-sale/main.js",
      template: "public/index.html",
      filename: "preemptive-pre-sale.html",
    },
    preemptivePurchase: {
      entry: "src/renderer/preemptive-purchase/main.js",
      template: "public/index.html",
      filename: "preemptive-purchase.html",
    },
    sphericalMenu: {
      entry: "src/renderer/spherical-menu/main.js",
      template: "public/index.html",
      filename: "spherical-menu.html",
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
      builderOptions: {
        productName: "scientist",
        appId: "com.leek.scientist",
        copyright: "韭菜社区",
        win: {
          icon: "/src/assets/icon.ico",
        },
      },
    },
  },
  transpileDependencies: ["quasar"],
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
};
