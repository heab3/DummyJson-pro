
<script setup>
import { ref, onMounted } from 'vue'
import { getPopularTVShow } from '../api'
import MovieCard from './MovieCard.vue'

const shows = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getPopularTVShow()
    shows.value = res.data.results
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="section">
    <h2>Popular TV Shows</h2>
    <div v-if="loading">Loading...</div>
    <div v-else class="grid">
      <MovieCard v-for="show in shows" :key="show.id" :movie="show" type="tv" />
    </div>
  </section>
</template>

<style scoped>
.section { margin: 24px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
</style>