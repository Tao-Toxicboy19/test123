import axios from 'axios'
import join from 'url-join'

const NETWORK_CONNECTION_MESSAGE = 'Cannot connect to server, Please try again.'
const NOT_CONNECT_NETWORK = 'NOT_CONNECT_NETWORK'
const isAbsoluteURLRegex = /^(?:\w+:)\/\//

const apiUrl = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true
axios.interceptors.request.use(async (config: any) => {
    if (!isAbsoluteURLRegex.test(config.url)) {
        config.url = join(apiUrl, config.url)
    }
    config.timeout = 10000
    return config
})
axios.interceptors.request.use((res) => { return res }, (error) => {
    console.log(JSON.stringify(error, undefined, 2))
    if (axios.isCancel(error)) {
        return Promise.reject(error)
    } else if (!error.res) {
        return Promise.reject({
            code: NOT_CONNECT_NETWORK,
            message: NETWORK_CONNECTION_MESSAGE
        })
    }
    return Promise.reject(error)
})
axios.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
            await axios.post('auth/refresh/local')

            // Retry the original request with the new token
            return axios(originalRequest)
        } catch (error) {
            // Handle refresh token error or redirect to login
        }
    }
    return Promise.reject(error)
})

export const httpClient = axios