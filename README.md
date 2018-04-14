# nexrad-radar-data
-

### v0.1.0
> A javascript implementation for decoding Nexrad Level II radar archive files. It currently does not support decoding bzip compressed radar data, or non-highres radar data. 

You can find more information on how radar data is encoded at [NOAA](https://www.roc.noaa.gov/WSR88D/BuildInfo/Files.aspx)

## Contents
1. [Install](#install)
2. [Usage](#usage)
3. [API](#Aapi)
4. [ToDo](#todo)
5. [License](#license)


## Install

``` bash
$ git clone https://github.com/bartholomew91/nexrad-radar-data.git
```

## Usage
``` javascript
const { Level2Radar } = require('./index')
const file_to_load = "KTLX20130420_205120_V06" // The radar archive file to load

new Level2Radar(file_to_load).then(radar => {
    console.log(radar.getHighresReflectivity())
})
```

## API

### setElevation(Number elevation)
Sets the elevation you want to grab the data from

### setScan(Number scan)
Sets the current scan you want to grab the data from

### setSweep(Number sweep)
Alias for **setScan**

### getHighresReflectivity()
Returns an Object of radar reflectivity data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

### getHighresVelocity()
Returns an Object of radar velocity data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

### getHighresSpectrum()
Returns an Object of radar spectrum data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

### getHighresDiffReflectivity()
Returns an Object of radar diff reflectivity data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

### getHighresDiffPhase()
Returns an Object of radar diff phase data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

### getHighresCorrelationCoefficient()
Returns an Object of radar correlation coefficient data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  message_size: Number,
  channel: Number,
  message_type: Number,
  id_sequence: Number,
  message_julian_date: Number,
  message_mseconds: Number,
  segment_count: Number,
  segment_number: Number,
  record: { 
     id: String,
     mseconds: Number,
     julian_date: Number,
     radial_number: Number,
     azimuth: Float,
     compress_idx: Number,
     sp: Number,
     radial_length: Number,
     ars: Number,
     rs: Number,
     elevation_number: Number,
     cut: Number,
     elevation: {
        block_type: String,
        name: String,
        size: Number,
        atmos: Number,
        calibration: Float 
     },
     rsbs: Number,
     aim: Number,
     dcount: Number,
     volume: {
        block_type: String,
        name: String,
        size: Number,
        version_major: Number,
        version_miner: Number,
        latitude: Float,
        longitude: Float,
        elevation: Number,
        feedhorn_height: Number,
        calibration: Float,
        tx_horizontal: Float,
        tx_vertical: Float,
        differential_reflectivity: Float,
        volume_coverage_pattern: Number 
     },
     radial: {
        block_type: String,
        name: String,
        size: Number,
        unambiguous_range: Number,
        horizontal_noise_level: Float,
        vertical_noise_level: Float,
        nyquist_velocity: Number
     },
     reflect: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     velocity: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Number,
        offset: Number
     },
     spectrum: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Float,
        addoffset: Number,
        offset: Number
     },
     zdr: {
        gate_count: Number,
        first_gate: Number,
        gate_size: Number,
        rf_threshold: Number,
        snr_threshold: Number,
        scale: Number,
        addoffset: Float,
        offset: Number
     }
  }
}
```

## ToDo
* Add bZip data decompression for newer archives
* Allow loading from tar files and web
* Add non-highres reflection and velocity data

## License
This work is based on the project of [Unidata](https://github.com/Unidata/thredds/blob/master/cdm/src/main/java/ucar/nc2/iosp/nexrad2/)

MIT © Matt Johnston