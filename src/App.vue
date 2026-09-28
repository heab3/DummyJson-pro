<template>
  <div class="app-layout">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="logo" @click="clearSearch">MOVIES API</RouterLink>

        <div class="links">
          <RouterLink to="/" @click="clearSearch">Home</RouterLink>
          <RouterLink to="/movies">Movies</RouterLink>
          <RouterLink to="/tv-shows">TV Shows</RouterLink>
          <RouterLink to="/about">About</RouterLink>

          <!-- Search Input -->
          <div class="search-box expanded">
            <button type="button" class="search-icon-btn" @click="handleSearchTrigger">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title..."
              class="search-input"
              @input="onInput"
              @keyup.enter="handleSearchTrigger"
            />

            <button 
              v-if="searchQuery" 
              type="button" 
              class="clear-icon-btn" 
              @click="clearSearch"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <main class="main-content">
      <!-- Active Search Results View -->
      <div v-if="searchQuery.trim()" class="search-results-container">
        <h2 class="search-title">
          Search Results for: <span>"{{ searchQuery }}"</span>
        </h2>

        <div v-if="loading" class="state-msg">
          <div class="spinner"></div>
          <p>Searching titles...</p>
        </div>

        <div v-else-if="movies.length > 0" class="movie-grid">
          <div v-for="movie in movies" :key="movie.id" class="movie-card">
            <div class="poster-box">
              <img 
                v-if="movie.poster_path" 
                :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
                :alt="movie.title || movie.name" 
              />
              <div v-else class="no-poster">
                <span>{{ movie.title || movie.name }}</span>
                <small>(No Image)</small>
              </div>
            </div>
            <div class="card-info">
              <h3>{{ movie.title || movie.name }}</h3>
              <p class="meta">
                <span>{{ (movie.release_date || movie.first_air_date || '').slice(0, 4) || 'Upcoming' }}</span>
                <span v-if="movie.vote_average">⭐ {{ movie.vote_average.toFixed(1) }}</span>
              </p>
            </div>
          </div>
        </div>

        <div v-else class="state-msg">
          <p>No results found for "{{ searchQuery }}".</p>
        </div>
      </div>

      <!-- Default Page View (Home/Movies/TV Shows) -->
      <RouterView v-else />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const API_KEY = '2eeeaa519bf36bfd51edb0c2e0659bd6'
const BASE_URL = 'https://api.themoviedb.org/3'

const searchQuery = ref('')
const movies = ref([])
const loading = ref(false)
let debounceTimer = null

const performSearch = async (query) => {
  if (!query.trim()) {
    movies.value = []
    return
  }

  loading.value = true

  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    )
    const data = await res.json()
    
    if (data.results && data.results.length > 0) {
      movies.value = data.results.filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
      )
    } else {
      // Fallback search strictly on movies
      const movieRes = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
      )
      const movieData = await movieRes.json()
      movies.value = movieData.results || []
    }
  } catch (err) {
    console.error('Fetch error:', err)
    movies.value = []
  } finally {
    loading.value = false
  }
}

const onInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performSearch(searchQuery.value)
  }, 350)
}

const handleSearchTrigger = () => {
  performSearch(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  movies.value = []
}
</script>

<style>
/* Global Styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #032541;
  font-family: Arial, sans-serif;
  color: #ffffff;
}

.app-layout {
  min-height: 100vh;
}

/* Navbar Styles */
.navbar {
  background: #032541;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #01b4e4;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
}

.links a.router-link-exact-active {
  color: #01b4e4;
}

/* Search Box Styles */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #01b4e4;
  border-radius: 20px;
  padding: 4px 10px;
}

.search-icon-btn,
.clear-icon-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  width: 200px;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  padding: 4px 8px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon-btn {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon-btn:hover {
  color: #ffffff;
}

/* Movie Results Grid */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 24px;
}

.search-title {
  font-size: 1.4rem;
  margin-bottom: 24px;
}

.search-title span {
  color: #01b4e4;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.movie-card {
  background: #0d253f;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.poster-box {
  width: 100%;
  aspect-ratio: 2/3;
  background: #01b4e410;
}

.poster-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-poster {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
  color: #aaaaaa;
}

.card-info {
  padding: 12px;
}

.card-info h3 {
  font-size: 0.95rem;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #01b4e4;
  margin: 0;
}

.state-msg {
  text-align: center;
  padding: 80px 0;
  color: #888;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #01b4e4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>