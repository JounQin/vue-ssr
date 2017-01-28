import stream from 'stream'

export default class HtmlWriterStream extends stream.Transform {
  constructor(options) {
    super()
    Object.assign(this, options)
  }

  _transform(chunk, encoding, done) {
    if (!this.started) {
      this.started = true
      this.push(this.header)
    }
    this.push(chunk)
    done()
  }

  _flush(done) {
    this.push(this.footer)
    this.push(null)
    this._lastLineData = null
    done()
  }
}
