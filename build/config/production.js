export default config => ({
  devTool: false,
  publicPath: `http://${config.serverHost}:${config.serverPort}/`
})
