import axios from 'axios'

const api = axios.create({
  baseURL: 'https://crstra-station.com/api/admin',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY as string,
  },
  timeout: 15000,
})

export default api
