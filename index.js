const { RandomAccessFile } = require('./classes/RandomAccessFile')
const { Level2Record } = require('./classes/Level2Record')
const { BIG_ENDIAN, FILE_HEADER_SIZE } = require('./constants')

class Level2Radar {
    constructor(file) {
        this.elevation = 0
        this.scan = 0
        return new Promise(resolve => {
            this.parseData(file).then(() => {
                resolve(this)
            })
        })
    }

    setElevation(elevation) {
        this.elevation = elevation - 1
    }

    setScan(scan) {
        this.scan = scan - 1
    }

    setSweep(sweep) {
        this.setScan(sweep)
    }

    getAzimuth(scan) {
        if(scan) {
            return this.data[this.elevation][scan].record.azimuth
        } else {
            return null
        }
    }

    getScans() {
        return this.data[this.elevation].length
    }

    // return reflectivity data for the current elevation and scan
    getHighresReflectivity(scan) {
        if(scan) {
            return this.data[this.elevation][scan].record.reflect
        } else {
            let scans = []
            for(let i = 0; i < this.data[this.elevation].length; i++) {
                scans.push(this.data[this.elevation][i].record.reflect)
            }
            return scans
        }
    }

    // return velocity data for the current elevation and scan
    getHighresVelocity() {
        return this.data[this.elevation][this.scan].record.velocity
    }

    // return spectrum data for the current elevation and scan
    getHighresSpectrum() {
        return this.data[this.elevation][this.scan].record.spectrum
    }

    // return diff reflectivity data for the current elevation and scan
    getHighresDiffReflectivity() {
        return this.data[this.elevation][this.scan].record.zdr
    }

    // return diff phase data for the current elevation and scan
    getHighresDiffPhase() {
        return this.data[this.elevation][this.scan].record.phi
    }

    // return correlation coefficient data for the current elevation and scan
    getHighresCorrelationCoefficient() {
        return this.data[this.elevation][this.scan].record.rho
    }

    /**
     * Loads the file and parses the data.
     * Returns a promise when completed
     */
    parseData(file) {
        return new Promise(resolve => {
            /**
             * Load and access the radar archive file.
             * The constructor for RandomAccessFile returns
             * a promise. This allows for parsing the data
             * after the file has been fully loaded into the
             * buffer.
             */
            new RandomAccessFile(file).then(raf => {
                let data = []

                raf.endianOrder(BIG_ENDIAN) // Set binary ordering to Big Endian
                raf.seek(FILE_HEADER_SIZE) // Jump to the bytes at 24, past the file header

                let message_offset31 = 0 // the current message 31 offset
                let recno = 0 // the record number

                /**
                 * Loop through all of the messages
                 * contained within the radar archive file.
                 * Save all the data we find to it's respective array
                 */
                while(true) {

                    let r = new Level2Record(raf, recno++, message_offset31)

                    if(r.finished) break // no more messages, exit the loop

                    if(r.message_type === 31) {
                        // found a message 31 type, update the offset
                        message_offset31 = message_offset31 + (r.message_size * 2 + 12 - 2432)
                    }

                    // skip any messages that aren't type of 1 (generic radar data) or 31 (highres radar data)
                    if(r.message_type != 1 && r.message_type != 31) continue

                    // If data is found, push the record to the data array
					if( r.record.reflect ||
						r.record.velocity ||
						r.record.spectrum ||
						r.record.zdr ||
						r.record.phi ||
						r.record.rho) data.push(r)

                }

                // sort and group the scans by elevation asc
                this.data = this.groupAndSortScans(data)

                resolve(true)
            })
        })
    }

    /**
     * This takes the scans (aka sweeps) and groups them
     * by their elevation numbers. This allows switching
     * between different elevations, if available.
     */
    groupAndSortScans(scans) {
        let groups = []

        // map the scans
        scans.map(scan => {
            let elevation_number = scan.record.elevation_number

            /**
             * If the group has already been created
             * just push the current scan into the array
             * or create a new group for the elevation
             * NOTE: !! we need to convert the numbers to a 
             * string so that javascript doesn't freak out 
             * look into fixing !!
             */
            if(groups[elevation_number]) {
                groups[elevation_number].push(scan)
            } else {
                groups[elevation_number] = [scan]
            }
        })

        // Sort by elevation number ascending
        groups = groups.sort((a, b) => {
            let a_elevation = a[0].record.elevation_number
            let b_elevation = b[0].record.elevation_number

            if(a_elevation > b_elevation) return 1
            if(a_elevation < b_elevation) return -1
            return 0
        })

        return groups
    }
}

module.exports.Level2Radar = Level2Radar