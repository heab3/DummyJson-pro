

import axios from 'axios'

const API_KEY = '2eeeaa519bf36bfd51edb0c2e0659bd6' 
const BASE_URL = 'https://api.themoviedb.org/3'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
})

export const getPopularMovies = () => api.get('/movie/popular')
export const getTrendingMovies = () => api.get('/trending/movie/week')
export const getNowPlayingMovies = () => api.get('/movie/now_playing')
export const getComingMovies = () => api.get('/movie/upcoming')
export const getPopularTVShow = () => api.get('/tv/popular')

export const getDetails = (type, id) => api.get(`/${type}/${id}`)
export const getCredits = (type, id) => api.get(`/${type}/${id}/credits`)
export const getSimilarMovies = (id) => api.get(`/movie/${id}/similar`)

export default api