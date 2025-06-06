const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/KPDash_for_Small_Business/' // <- Убедитесь, что это название вашего репозитория!
    : '/'
})