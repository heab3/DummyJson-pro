


<script setup>
import TrendingMovies from '../components/TrendingMovies.vue'
import PopularMovies from '../components/PopularMovies.vue'
</script>

<template>
  <div class="page-container">
    <TrendingMovies />
    <PopularMovies />
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>