# nexrad-radar-data
-

### v0.2.0
> A javascript implementation for decoding Nexrad Level II radar archive files. It currently does not support decoding bzip compressed radar data, or non-highres radar data. 

You can find more information on how radar data is encoded at [NOAA](https://www.roc.noaa.gov/WSR88D/BuildInfo/Files.aspx)

## Contents
1. [Install](#install)
2. [Usage](#usage)
3. [API](#api)
4. [Known Issues](#known-issues)
5. [ToDo](#todo)
6. [License](#license)


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
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```

### getHighresVelocity()
Returns an Object of radar velocity data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```

### getHighresSpectrum()
Returns an Object of radar spectrum data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```

### getHighresDiffReflectivity()
Returns an Object of radar diff reflectivity data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```

### getHighresDiffPhase()
Returns an Object of radar diff phase data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```

### getHighresCorrelationCoefficient()
Returns an Object of radar correlation coefficient data for the current **elevation** and **scan** in the following format

``` javascript
{ 
  	gate_count: Number,
	first_gate: Number,
	gate_size: Number,
	rf_threshold: Number,
	snr_threshold: Number,
	scale: Number,
	offset: Number,
	data_offset: Number,
	moment_data: Array
}
```
## Known Issues
1. RHO moment data parsing is not working

## ToDo
* Add bZip data decompression for newer archives
* Allow loading from tar files and web
* Add non-highres reflection and velocity data

## License
This work is based on the project of [Unidata](https://github.com/Unidata/thredds/blob/master/cdm/src/main/java/ucar/nc2/iosp/nexrad2/)

MIT © Matt Johnston