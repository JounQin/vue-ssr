import stream from 'stream'

export default class HtmlWriterStream extends stream.Transform {
  constructor(options = {}) {
    super(options)
    Object.assign(this, options, {
      started: false
    })
  }

  head(data) {
    this.push(this.header)
    this.push(data)
    this.started = true
  }

  body(data) {
    this.push(data.toString())
  }

  foot() {
    this.push(this.footer)
    this.push(null)
  }

  _transform(chunk, encoding, done) {
    const data = chunk.toString()
    this.started ? this.body(data) : this.head(data)
    done()
  }

  _flush(done) {
    this.foot()
    this._lastLineData = null
    done()
  }
}
