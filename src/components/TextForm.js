import React, {useState, useEffect} from 'react'
import axios from 'axios'

// helper to separate strings into under 5000 characters to read
function textSlicer(text) {
    let newString = []
    let pointa, pointb = 0
    let mytext = text

    // checks for the last period under 5000 characters and slices from there
    while (mytext.length > 5000) {
        let myString = mytext.slice(pointa,5000)
        pointb = myString.lastIndexOf('.')
        myString = mytext.slice(pointa, pointb+1)
        newString.push(myString)
        mytext = mytext.slice(pointb+1)
    }
    // adds the rest of the text
    newString.push(mytext)

    return newString
}

let aud = null
const { REACT_APP_API_KEY } = process.env
const initAudioContent = []


function TextForm() {
    const [text, setText] = useState()
    const [audioContent, setAudioContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [ref, setRef] = useState([])

    const onChange = (e) => {
        const {value} = e.target
        setText(value)
    }

    const clear = (e) => {
        e.preventDefault()
        console.log('clearing audioContent')
        setAudioContent(initAudioContent)
    }

    const onSubmit = async (e, ) => {
        e.preventDefault()
        let nameArr = []
        let audioText = ''
        let progress = 0
        // console.log(`the character length of this text block is ${text.length}`)
        const newText = textSlicer(text)
        for (var i = 0; i<newText.length; i++) {
            
            const request = {
                input:{text:`${newText[i]}`},
                voice: {languageCode: 'en-US', name:'en-US-Wavenet-F', ssmlGender:'FEMALE'},
                audioConfig: {
                    audioEncoding: 'MP3', 
                    effectsProfileId: ["headphone-class-device"],
                    pitch: 0,
                    speakingRate:1
                }
            }
            progress += 1
            nameArr.push(`aud_${progress}`)
            let generatedText = await sendPost(progress, request, newText.length)
            audioText += generatedText
            // audioText += localStorage.getItem(`aud_${progress}`)
            console.log(request)
            
        }
        console.log(`This is the array text block`, newText)
        setRef(nameArr)
        setAudioContent(audioText)
        
    }

    const sendPost = async (progress, request, length) => {
        try {
            const response = await axios.post(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${REACT_APP_API_KEY}`, request)
            console.log(`done fetching data ${progress}/${length}`)
            // localStorage.setItem(`aud_${progress}`, response.data.audioContent)
            if (progress === length) {
                setLoading(false)
            } else {
                setLoading(true)
            }
            return response.data.audioContent
        }
        catch (err) {
            console.log(err.message)
        }
        console.log(`done with process ${progress}`)
    }

    return (
    <div>
        <form id='textForm' onSubmit={onSubmit}>
            <label> Text-To-Speech:
                <textarea
                type='text'
                name='audioText'
                onChange={onChange}
                value={text}
                />
            </label>
            <button>Convert</button>
            <audio controls src={`data:audio/ogg;base64,${audioContent}`}></audio>
            <button onClick={clear}>Clear</button>
        </form>
    </div>
    )

}

export default TextForm