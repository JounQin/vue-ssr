export default config => ({
  devTool: 'eval',
  publicPath: `http://${config.serverHost}:${config.serverPort}/`
})
