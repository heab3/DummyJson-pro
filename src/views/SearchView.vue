<template>
  <div class="search-page">
    <div class="container">
      <h2 v-if="searchQuery" class="page-title">
        Search Results for Movie Name: <span>"{{ searchQuery }}"</span>
      </h2>

      <!-- Loading Spinner -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Searching movies by name...</p>
      </div>

      <!-- Movie Cards Grid -->
      <div v-else-if="movies.length > 0" class="movie-grid">
        <div 
          v-for="movie in movies" 
          :key="movie.id" 
          class="movie-card"
        >
          <div class="poster-box">
            <img 
              v-if="movie.poster_path" 
              :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
              :alt="movie.title" 
            />
            <div v-else class="no-poster">
              <span>{{ movie.title }}</span>
              <small>(No Image Available)</small>
            </div>
          </div>
          
          <div class="card-details">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <div class="meta-info">
              <span class="release-year">
                {{ movie.release_date ? movie.release_date.slice(0, 4) : 'N/A' }}
              </span>
              <span v-if="movie.vote_average" class="rating">
                ⭐ {{ movie.vote_average.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery" class="state-container">
        <p>No movie found with the name "{{ searchQuery }}".</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ⚠️ Replace with your actual TMDB API Key
const API_KEY = 'YOUR_TMDB_API_KEY'
const BASE_URL = 'https://api.themoviedb.org/3'

const movies = ref([])
const searchQuery = ref('')
const loading = ref(false)

const searchMovieByName = async (movieName) => {
  if (!movieName || !movieName.trim()) {
    movies.value = []
    searchQuery.value = ''
    return
  }

  searchQuery.value = movieName.trim()
  loading.value = true

  try {
    // Direct endpoint to search explicitly by movie title/name
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&include_adult=false&page=1`
    )
    
    if (!res.ok) {
      throw new Error(`TMDB Request Failed with status: ${res.status}`)
    }

    const data = await res.json()
    movies.value = data.results || []
  } catch (error) {
    console.error('Error searching movie by name:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// Automatically re-run search when query string in URL changes (?q=movieName)
watch(
  () => route.query.q,
  (newName) => {
    searchMovieByName(newName)
  },
  { immediate: true }
)
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 70px);
  background-color: #032541;
  padding: 30px 24px;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.4rem;
  margin-bottom: 24px;
}

.page-title span {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.poster-box {
  width: 100%;
  aspect-ratio: 2/3;
  background: rgba(1, 180, 228, 0.1);
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
  padding: 12px;
  text-align: center;
  color: #888888;
}

.card-details {
  padding: 12px;
}

.movie-title {
  font-size: 0.95rem;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.release-year {
  color: #01b4e4;
  font-weight: bold;
}

.rating {
  color: #ffc107;
}

.state-container {
  text-align: center;
  padding: 80px 0;
  color: #888888;
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