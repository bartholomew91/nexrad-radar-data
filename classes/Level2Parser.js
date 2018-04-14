const { MESSAGE_HEADER_SIZE } = require('../constants')

class Level2Parser {
    constructor(raf = null, dbp = null, offset = null) {
        this._raf = raf
        this._dbp = dbp
        this._record_offset = offset
    }

    setRaf(raf) {
        this._raf = raf
    }

    setDataBlockPointer(dbp) {
        this._dbp = dbp
    }

    setRecordOffset(offset) {
        this._record_offset = offset
    }

    getDataBlockByte(skip) {
        this._raf.seek(this._dbp + this._record_offset + MESSAGE_HEADER_SIZE)
        this._raf.skip(skip)

        return this._raf.read()
    }

    getDataBlockShort(skip) {
        this._raf.seek(this._dbp + this._record_offset + MESSAGE_HEADER_SIZE)
        this._raf.skip(skip)

        return this._raf.readShort()
    }

    getDataBlockFloat(skip) {
        this._raf.seek(this._dbp + this._record_offset + MESSAGE_HEADER_SIZE)
        this._raf.skip(skip)

        return this._raf.readFloat()
    }

    getDataBlockString(skip, size) {
        this._raf.seek(this._dbp + this._record_offset + MESSAGE_HEADER_SIZE)
        this._raf.skip(skip)

        return this._raf.readString(size)
    }
}

module.exports.Level2Parser = Level2Parser