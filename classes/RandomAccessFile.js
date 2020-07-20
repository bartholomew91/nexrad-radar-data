const fs = require('fs')
const { BIG_ENDIAN } = require('../constants')

/**
 * Implementation for loading a file into the buffer
 * and seeking/reading the data at specific offsets
 */
class RandomAccessFile {
    /**
     * Returns a promise once the file has been
     * loaded into the buffer
     */
    constructor(file) {
        this.offset = 0
        this.buffer = null
        this.bigEndian = false

		// load a file if a string was provided
		if (typeof file === 'string') {
			return new Promise(resolve => {
				this.loadFile(file).then(data => {
					this.buffer = Buffer.from(data, "binary")
					resolve(this)
				})
			})
		} else {
			// load the buffer directly and return a promise for consistency
			return new Promise(resolve => {
				this.buffer = file;
				resolve(this);
			})
		}
    }

    // return the current buffer length
    getLength() {
        return this.buffer.length
    }

	// return the current position in the file
	getPos() {
		return this.offset;
	}

    // load the file into the buffer
    loadFile(file) {
        return new Promise(resolve => {
            fs.readFile(file, (error, data) => {
                resolve(data)
            })
        })
    }

    // seek to a provided buffer offset
    seek(byte) {
        this.offset = byte
    }

    // set the binary endian order
    endianOrder(endian) {
        if(endian < 0) return
        this.bigEndian = (endian === BIG_ENDIAN)
    }

    // read a string from the buffer
    readString(bytes) {
        let data = this.buffer.toString("utf-8", this.offset, (this.offset += bytes))

        return data
    }

    // read a float from the buffer
    readFloat() {
        let float = (this.bigEndian) ? this.buffer.readFloatBE(this.offset) : this.buffer.readFloatLE(this.offset)
        this.offset += 4

        return float
    }

    // read a number from the buffer
    readInt() {
        let int = (this.bigEndian) ? this.buffer.readIntBE(this.offset, 4) : this.buffer.readIntLE(this.offset, 4)
        this.offset += 4

        return int
    }

    // read a short from the buffer
    readShort() {
        let short = (this.bigEndian) ? this.buffer.readIntBE(this.offset, 2) : this.buffer.readIntLE(this.offset, 2)
        this.offset += 2

        return short
    }

    // read a byte from the buffer
    readByte() {
        return this.read()
    }

    // read a set number of bytes from the buffer
    read(bytes = 1) {
        let data = null
        if(bytes > 1) {
            data = this.buffer.slice(this.offset, bytes)
            this.offset += bytes
        } else {
            data = this.buffer[this.offset]
            this.offset++
        }

        return data
    }

    // skip a set number of bites and update the offset
    skip(bytes) {
        this.offset += bytes
    }
}

module.exports.RandomAccessFile = RandomAccessFile