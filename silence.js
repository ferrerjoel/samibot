const { Readable } = require('stream');

class Silence extends Readable {
  constructor(options = {}) {
    super(options);
  }

  _read(size) {
    // Generate silence data (0s) of the specified size
    const silenceData = Buffer.alloc(size, 0);
    this.push(silenceData);
  }
}

module.exports = Silence;
