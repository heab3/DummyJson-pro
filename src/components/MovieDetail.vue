<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

import Cast from './Cast.vue'
import SimilarMovies from './SimilarMovies.vue'

const route = useRoute()

const movie = ref(null)
const cast = ref([])
const similarMovies = ref([])

const loading = ref(true)
const error = ref('')

async function getMovieDetails() {
  try {
    const id = route.params.id

    const movieResponse = await api.get(`/movie/${id}`)

    movie.value = movieResponse.data

    const creditsResponse = await api.get(`/movie/${id}/credits`)

    cast.value = creditsResponse.data.cast

    const similarResponse = await api.get(`/movie/${id}/similar`)

    similarMovies.value = similarResponse.data.results
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load movie details.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getMovieDetails()
})
</script>

<template>
  <div class="detail-page">

    <p v-if="loading">
      Loading...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <div v-else-if="movie">

      <section class="movie-detail">

        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
        />

        <div>
          <h1>{{ movie.title }}</h1>

          <p>⭐ {{ movie.vote_average?.toFixed(1) }}</p>

          <p>
            Release date:
            {{ movie.release_date }}
          </p>

          <p>
            Runtime:
            {{ movie.runtime }} minutes
          </p>

          <p>
            {{ movie.overview }}
          </p>
        </div>

      </section>

      <Cast :cast="cast" />

      <SimilarMovies :movies="similarMovies" />

    </div>

  </div>
</template>