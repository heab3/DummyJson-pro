
<script setup>
import { ref, onMounted } from 'vue'
import { getTrendingMovies } from '../api'
import MovieCard from './MovieCard.vue'

const movies = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getTrendingMovies()
    movies.value = res.data.results
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="section">
    <h2>Trending Movies</h2>
    <div v-if="loading">Loading...</div>
    <div v-else class="grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" type="movie" />
    </div>
  </section>
</template>

<style scoped>
.section {margin: 24px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
</style>