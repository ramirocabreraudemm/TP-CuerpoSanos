import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export default http