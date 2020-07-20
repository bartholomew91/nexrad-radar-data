// decompress a nexrad level 2 archive, or return the provided file if it is not compressed

// bzip
const bzip = require('seek-bzip');

// structured byte access
const {RandomAccessFile} = require('./classes/RandomAccessFile');

// constants
const {BIG_ENDIAN, FILE_HEADER_SIZE} = require('./constants');

const decompress = function (raf) {
	return new Promise(resolve => {
		// set endian-ess
		raf.endianOrder(BIG_ENDIAN);

		// skip file header
		raf.seek(FILE_HEADER_SIZE)

		// get the compression record 
		const compression_record = read_compression_header(raf);

		// test for the magic number 'BZh' for a bzip compressed file
		if (compression_record.header !== 'BZh') {
			// not compressed, return the original file after resetting the pointer to zero
			raf.seek(0);
			resolve(raf);
		} else {
			// compressed file, start decompressing
			// the format is (int) size of block + 'BZh9' + compressed data block, repeat
			// start by locating the begining of each compressed block by jumping to each offset noted by the size header
			let positions = [];
			// jump back before the first detected compression header
			raf.seek(raf.getPos() - 8);
			
			// loop until the end of the file is reached
			while (raf.getPos() < raf.getLength()) {
				// block size may be negative
				const size = Math.abs(raf.readInt());
				// store the position
				positions.push({
					pos: raf.getPos(),
					size: size,
				})
				// jump forward
				raf.seek(raf.getPos() + size)
			}

			// reuse the original header
			const outBuffers = [raf.buffer.slice(0,FILE_HEADER_SIZE)];

			// loop through each block and decompress it
			positions.forEach(function (block) {
				// extract the block from the buffer
				const compressed = raf.buffer.slice(block.pos, block.pos + block.size);
				const output = bzip.decodeBlock(compressed, 32); // skip 32 bits 'BZh9' header
				outBuffers.push(output);
			});

			// combine the buffers
			const outBuffer = Buffer.concat(outBuffers);

			// pass the buffer to RandomAccessFile and return the result
			new RandomAccessFile(outBuffer).then(raf => {
					resolve(raf)
				});
		}
	})
}

// compression header is (int) size of block + 'BZh' + one character block size
const read_compression_header = function (raf) {
	return {
		size: raf.readInt(),
		header: raf.readString(3),
		block_size: raf.readString(1),
	}
}

module.exports = decompress;