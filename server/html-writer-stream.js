import stream from 'stream'

export default class HtmlWriterStream extends stream.Transform {
  started = false

  constructor(options) {
    super()
    Object.assign(this, options)
  }

  head() {
    this.push(this.header)
    this.started = true
  }

  body(data) {
    this.push(data)
  }

  foot() {
    this.push(this.footer)
    this.push(null)
  }

  _transform(chunk, encoding, done) {
    this.started || this.head(chunk)
    this.body(chunk)
    done()
  }

  _flush(done) {
    this.foot()
    this._lastLineData = null
    done()
  }
}
