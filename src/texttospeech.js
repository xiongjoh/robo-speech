require('dotenv').config()

// unable to import
const textToSpeech = require('@google-cloud/text-to-speech')

const fs = require('fs')
const util = require('util')

const client = new textToSpeech.TextToSpeechClient()
async function generateAudio(name) {

    var text = fs.readFileSync('./text.txt', 'utf8')
    var sentenceArr = text.match(/[^\.]+./g)

    var charCount = 0
    var textChunk = "";
    var index = 0;

    for (var n = 0; n < sentenceArr.length; n++) {

        charCount += newArr[n].length
    }

    const request = {
        input:{text:text},
        voice: {languageCode: 'en-US', name:'en-US-Wavenet-F', ssmlGender:'FEMALE'},
        audioConfig: {
            audioEncoding: 'MP3', 
            effectsProfileId: ["headphone-class-device"],
            pitch: 0,
            speakingRate:1
        }
    }

    const [response] = await client.synthesizeSpeech(request);

    const writeFile = util.promisify(fs.writeFile)
    await writeFile(`output${name}_${index}.mp3`, response.audioContent, 'binary')
    console.log(`Audio content written to file: output${name}.mp3`)
}

generateAudio('hello world!', 'name12')

module.exports = generateAudio