const { Level2Radar } = require('./index')
const file_to_load = "KLOT20200715_230602_V06" // The radar archive file to load

Math.radians = function(degrees) {
    return degrees * Math.PI / 180
}

new Level2Radar(file_to_load).then(radar => {
    //console.log(radar.getHighresReflectivity())
    let reflectivity = radar.getHighresReflectivity()
    let azimuth = radar.getAzimuth()

    console.log(reflectivity)
    console.log(azimuth)
})