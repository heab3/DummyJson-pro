
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getSimilarMovies } from '../api'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  movieId: { type: [Number, String], required: true }
})

const movies = ref([])

async function fetchSimilar() {
  if (!props.movieId) return
  try {
    const res = await getSimilarMovies(props.movieId)
    movies.value = res.data.results.slice(0, 5)
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchSimilar)
watch(() => props.movieId, fetchSimilar)
</script>

<template>
  <section v-if="movies.length" class="section">
    <h2>Similar Movies</h2>
    <div class="grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" type="movie" />
    </div>
  </section>
</template>

<style scoped>
.section { margin: 30px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
</style>