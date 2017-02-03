export default ({headers, method, url}, options = {}) => {
  const logger = getLogger(options)

  if (method !== 'GET') {
    logger(
      'Not intercepting',
      method,
      url,
      'because the method is not GET.'
    )
    return true
  }

  if (!headers || typeof headers.accept !== 'string') {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client did not send an HTTP accept header.'
    )
    return true
  }

  if (headers.accept.indexOf('application/json') === 0) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client prefers JSON.'
    )
    return true
  }

  if (!acceptsHtml(headers.accept, options)) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client does not accept HTML.'
    )
    return true
  }

  const parsedUrl = require('url').parse(url)

  if (parsedUrl.pathname.indexOf('.') + 1 && !options.disableDotRule) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the path includes a dot (.) character.'
    )
    return true
  }
}

const acceptsHtml = (header, {htmlAcceptHeaders = ['text/html', '*/*']}) =>
  !!htmlAcceptHeaders.find(acceptHeader => header.indexOf(acceptHeader) + 1)

const getLogger = ({logger, verbose}) => logger || (verbose ? console.log.bind(console) : function () {})
