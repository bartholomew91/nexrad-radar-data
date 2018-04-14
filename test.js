const { Level2Radar } = require('./index')
const file_to_load = "KTLX20130420_205120_V06" // The radar archive file to load

new Level2Radar(file_to_load).then(radar => {
    console.log(radar.getHighresReflectivity())
})