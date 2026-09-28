<!-- <script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import MovieCard from '../components/MovieCard.vue'

const movies = ref([])

async function getMovies() {
  try {
    const response = await api.get('/discover/movie')

    movies.value = response.data.results
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getMovies()
})
</script>

<template>
  <div class="page">

    <h1>Movies</h1>

    <div class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
      />
    </div>

  </div>
</template> -->




<script setup>
import PopularMovies from '../components/PopularMovies.vue'
import NowPlaying from '../components/NowPlaying.vue'
import ComingMovies from '../components/ComingMovies.vue'
</script>

<template>
  <div class="page-container">
    <NowPlaying />
    <PopularMovies />
    <ComingMovies />
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>