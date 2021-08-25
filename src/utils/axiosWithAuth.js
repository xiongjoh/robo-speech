import axios from 'axios'

const axiosWithAuth = () => {
    
    const token = localStorage.getItem('token')

    return axios.create({
        baseURL: 'https://texttospeech.googleapis.com',
        headers:{
            authorization:token
        }
    })
}

export default axiosWithAuth