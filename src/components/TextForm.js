import React, {useState} from 'react'
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



function TextForm() {
    const [text, setText] = useState()
    const [audioContent, setAudioContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [playing, setPlaying] = useState(false)

    const onChange = (e) => {
        const {value} = e.target
        setText(value)
    }
    // const playAudio = (e) => {
    //     e.preventDefault()
    //     console.log('playing audio')
    //     if (audioContent !== '') {
    //         aud = new Audio(`data:audio/ogg;base64,${audioContent}`)
    //     }
    //     setAudioContent('')
    //     setPlaying(true)
    //     aud.play()
    // }
    // const pauseAudio = (e) => {
    //     e.preventDefault()
    //     console.log('pausing audio')
    //     setPlaying(false)
    //     aud.pause()
    // }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(`the character length of this text block is ${text.length}`)
        let progress = 0
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
            console.log(request)
            // localStorage.setItem(`aud_${i}`, request.input.text)
            axios
            .post(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${REACT_APP_API_KEY}`, request)
            .then(res => {
                setTimeout(setAudioContent(audioContent + res.data.audioContent), 2000)
                progress += 1
                console.log(`done fetching ${progress}/${newText.length}`, )
                if(progress === newText.length) {
                    setLoading(false)
                    progress = 0
                } else {
                    setLoading(true)
                }
            })
            .catch(err => {
                console.log(err.message)
            })
        }
        console.log(`This is the array text block`, newText)
        
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
            <audio disable={loading} controls src={`data:audio/ogg;base64,${audioContent}`}></audio>
            {/* {playing 
            ? <button onClick={pauseAudio} disabled={loading}>Pause</button>
            : <button onClick={playAudio} disabled={loading}>Play</button>} */}
        </form>
    </div>
    )

}

export default TextForm