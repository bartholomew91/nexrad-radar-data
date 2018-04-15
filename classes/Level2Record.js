const { Level2Parser } = require('./Level2Parser')
const { MESSAGE_HEADER_SIZE, FILE_HEADER_SIZE, RADAR_DATA_SIZE, CTM_HEADER_SIZE } = require('../constants')

/**
 * Returns a record from the loaded radar data
 */
class Level2Record {
    constructor(raf, record, message31_offset) {
        this._record_offset = record * RADAR_DATA_SIZE + FILE_HEADER_SIZE + message31_offset

        // passed the buffer, finished reading the file
        if(this._record_offset >= raf.getLength()) return { finished: true }

        // return the current record data
        return this._getRecord(raf)
    }

    /**
     * Creates a new parser and grabs the data
     * from the data blocks. Then save that data
     * to the record.volume Object
     * See page 114; Section "Data Block #1" https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/RDA_RPG_2620002P.pdf
     */
    _parseVolumeData(raf, record, data_block_pointer) {
        let parser = new Level2Parser(raf, data_block_pointer, this._record_offset)
        let data = {
            block_type: parser.getDataBlockString(0, 1),
            name: parser.getDataBlockString(1, 3),
            size: parser.getDataBlockShort(4),
            version_major: parser.getDataBlockByte(6),
            version_miner: parser.getDataBlockByte(7),
            latitude: parser.getDataBlockFloat(8),
            longitude: parser.getDataBlockFloat(12),
            elevation: parser.getDataBlockShort(16),
            feedhorn_height: parser.getDataBlockByte(18),
            calibration: parser.getDataBlockFloat(20),
            tx_horizontal: parser.getDataBlockFloat(24),
            tx_vertical: parser.getDataBlockFloat(28),
            differential_reflectivity: parser.getDataBlockFloat(32),
            volume_coverage_pattern: parser.getDataBlockByte(40)
        }

        record.volume = data
    }

    /**
     * Creates a new parser and grabs the data
     * from the data blocks. Then save that data
     * to the record.elevation Object
     * See page 114; Section "Data Block #2" https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/RDA_RPG_2620002P.pdf
     */
    _parseElevationData(raf, record, data_block_pointer) {
        let parser = new Level2Parser(raf, data_block_pointer, this._record_offset)
        let data = {
            block_type: parser.getDataBlockString(0, 1),
            name: parser.getDataBlockString(1, 3),
            size: parser.getDataBlockShort(4),
            atmos: parser.getDataBlockShort(6),
            calibration: parser.getDataBlockFloat(8)
        }

        record.elevation = data
    }

    /**
     * Creates a new parser and grabs the data
     * from the data blocks. Then save that data
     * to the record.radial Object
     * See page 115; Section "Data Block #3" https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/RDA_RPG_2620002P.pdf
     */
    _parseRadialData(raf, record, data_block_pointer) {
        let parser = new Level2Parser(raf, data_block_pointer, this._record_offset)
        let data = {
            block_type: parser.getDataBlockString(0, 1),
            name: parser.getDataBlockString(1, 3),
            size: parser.getDataBlockShort(4),
            unambiguous_range: parser.getDataBlockShort(6),
            horizontal_noise_level: parser.getDataBlockFloat(8),
            vertical_noise_level: parser.getDataBlockFloat(12),
            nyquist_velocity: parser.getDataBlockShort(16)
        }

        record.radial = data
    }

    /**
     * Creates a new parser and grabs the data
     * from the data blocks. Then save that data
     * to the record.(reflect|velocity|spectrum|zdr|phi|rho)
     * Object base on what type being parsed
     * See page 115-117; Section "Data Block #4-9" https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/RDA_RPG_2620002P.pdf
     */
    _parseMomentData(raf, record, data_block_pointer, type) {
        if(data_block_pointer > 0) {
            let parser = new Level2Parser(raf, data_block_pointer, this._record_offset)
            let data = {
                gate_count: parser.getDataBlockShort(8),
                first_gate: parser.getDataBlockShort(10),
                gate_size: parser.getDataBlockShort(12),
                rf_threshold: parser.getDataBlockShort(14),
                snr_threshold: parser.getDataBlockShort(16),
                scale: parser.getDataBlockInt(20),
                offset: parser.getDataBlockInt(24),
                data_offset: data_block_pointer + 28,
                moment_data: []
            }
            
            switch(type) {
                case 'REF':
                    for(let i = 28; i <= 1867; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    }
                    record.reflect = data
                    break
                case 'VEL':
                    for(let i = 28; i <= 1227; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    }
                    record.velocity = data
                    break
                case 'SW':
                    for(let i = 28; i <= 1227; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    }
                    record.spectrum = data
                    break
                case 'ZDR':
                    for(let i = 28; i <= 1227; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    }
                    record.zdr = data
                    break
                case 'PHI':  
                    for(let i = 28; i <= 1227; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    }
                    record.phi = data
                    break
                case 'RHO':
                    // RHO - getting indexing errors - !!FIX!!
                    /* for(let i = 28; i <= 1227; i += 4) {
                        data.moment_data.push((parser.getDataBlockInt(i) - data.offset) / data.scale)
                    } */
                    record.rho = data
                    break
            }
        }
    }

    /**
     * o--------------o-----------------------------o
     * | Message type | Data                        |
     * |--------------|-----------------------------|
     * | 2            | RDA Status                  |
     * | 3            | RDA Performance/Maintenance |
     * | 5            | RDA Volume Coverage         |
     * | 13           | Clutter Filter Bypass Map   |
     * | 15           | Clutter Map                 |
     * | 18           | RDA Adaptable Parameters    |
     * | 29           | Model Data Message          |
     * | 31           | Digital Radar Generic Format|
     * o--------------o-----------------------------o
     */
    _getRecord(raf) {
        raf.seek(this._record_offset)
        raf.skip(CTM_HEADER_SIZE)

        let message = {
            message_size: raf.readShort(),
            channel: raf.readByte(), 
            message_type: raf.readByte(),
            id_sequence: raf.readShort(),
            message_julian_date: raf.readShort(),
            message_mseconds: raf.readInt(),
            segment_count: raf.readShort(),
            segment_number: raf.readShort()
        }

        if(message.message_type == 31) {
            message.record = {
                id: raf.readString(4),
                mseconds: raf.readInt(),
                julian_date: raf.readShort(),
                radial_number: raf.readShort(),
                azimuth: raf.readFloat(),
                compress_idx: raf.readByte(),
                sp: raf.readByte(),
                radial_length: raf.readShort(),
                ars: raf.readByte(),
                rs: raf.readByte(),
                elevation_number: raf.readByte(),
                cut: raf.readByte(),
                elevation: raf.readFloat(),
                rsbs: raf.readByte(),
                aim: raf.readByte(),
                dcount: raf.readShort()
            }

            /**
             * Read and save the data pointers from the file
             * so we know where to start reading within the file
             * to grab the data from the data blocks
             * See page 114 of https://www.roc.noaa.gov/wsr88d/PublicDocs/ICDs/RDA_RPG_2620002P.pdf
             */
            let dbp1 = raf.readInt()
            let dbp2 = raf.readInt()
            let dbp3 = raf.readInt()
            let dbp4 = raf.readInt()
            let dbp5 = raf.readInt()
            let dbp6 = raf.readInt()
            let dbp7 = raf.readInt()
            let dbp8 = raf.readInt()
            let dbp9 = raf.readInt()

            /**
             * Parse all of our data inside the datablocks
             * and save it to the message.record Object
             */
            this._parseVolumeData(raf, message.record, dbp1)
            this._parseElevationData(raf, message.record, dbp2)
            this._parseRadialData(raf, message.record, dbp3)
            this._parseMomentData(raf, message.record, dbp4, 'REF')
            this._parseMomentData(raf, message.record, dbp5, 'VEL')
            this._parseMomentData(raf, message.record, dbp6, 'SW')
            this._parseMomentData(raf, message.record, dbp7, 'ZDR')
            this._parseMomentData(raf, message.record, dbp8, 'PHI')
            this._parseMomentData(raf, message.record, dbp9, 'RHO')
        }

        if(message.message_type == 1) {

            message.record = {
                mseconds: raf.readInt(),
                julian_date: raf.readShort(),
                range: raf.readShort(),
                azmith_angle: raf.readShort(),
                radial_number: raf.readShort(),
                radial_status: raf.readShort(),
                elevation_angle: raf.readShort(),
                elevation_number: raf.readShort(),
                reflect_first_gate: raf.readShort(),
                doppler_first_gate: raf.readShort(),
                reflect_gate_size: raf.readShort(),
                doppler_gate_size: raf.readShort(),
                reflect_gate_count: raf.readShort(),
                doppler_gate_count: raf.readShort(),
                cut: raf.readShort(),
                calibration: raf.readFloat(),
                reflect_offset: raf.readShort(),
                velocity_offset: raf.readShort(),
                width_offset: raf.readShort(),
                resolution: raf.readShort(),
                vcp: raf.readShort()
            }

            raf.skip(14)

            message.record.nyquist_vel = raf.readShort()
            message.record.attenuation = raf.readShort()
            message.record.threshold = raf.readShort()
            message.record.has_reflection_data = message.record.reflect_gate_count > 0
            message.record.has_doppler_data = message.record.doppler_gate_count > 0
        }

        return message
    }
}

module.exports.Level2Record = Level2Record