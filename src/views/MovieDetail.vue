<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getDetails, getCredits } from '../api'
import Cast from '../components/Cast.vue'
import SimilarMovies from '../components/SimilarMovies.vue'

const props = defineProps({
  type: { type: String, default: 'movie' }
})

const route = useRoute()
const detail = ref(null)
const castList = ref([])
const loading = ref(true)

const title = computed(() => detail.value?.name || detail.value?.title)
const releaseYear = computed(() => {
  const date = detail.value?.first_air_date || detail.value?.release_date
  return date ? new Date(date).getFullYear() : ''
})

const userScore = computed(() =>
  detail.value?.vote_average ? Math.round(detail.value.vote_average * 10) : 0
)

const backdropUrl = computed(() =>
  detail.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${detail.value.backdrop_path}`
    : ''
)

const posterUrl = computed(() =>
  detail.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.value.poster_path}`
    : ''
)

async function fetchData() {
  loading.value = true
  try {
    const id = route.params.id
    const [detailRes, creditsRes] = await Promise.all([
      getDetails(props.type, id),
      getCredits(props.type, id)
    ])
    detail.value = detailRes.data
    castList.value = creditsRes.data.cast.slice(0, 10)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
watch(() => route.params.id, fetchData)
</script>

<template>
  <div v-if="loading" class="loading">Loading...</div>

  <div v-else-if="detail" class="detail-page">
    <div
      class="hero-banner"
      :style="{ backgroundImage: `linear-gradient(to right, rgba(30, 20, 15, 0.92), rgba(30, 20, 15, 0.80)), url(${backdropUrl})` }"
    >
      <div class="hero-container">
        <div class="poster-container">
          <div class="poster-box">
            <img :src="posterUrl" :alt="title" />
          </div>
        </div>

        <div class="meta-content">
          <h1 class="title">{{ title }} <span class="year">({{ releaseYear }})</span></h1>

          <div class="actions">
            <div class="score-box">
              <div class="score-circle">
                {{ userScore }}<sup>%</sup>
              </div>
              <span class="score-label">User<br />Score</span>
            </div>
          </div>

          <p class="tagline">{{ detail.tagline }}</p>

          <div class="overview">
            <h3>Overview</h3>
            <p>{{ detail.overview }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cast-section">
      <h2>Series Cast</h2>
      <div class="cast-carousel">
        <Cast v-for="actor in castList" :key="actor.id" :actor="actor" />
      </div>

      <SimilarMovies v-if="type === 'movie'" :movie-id="detail.id" />
    </div>
  </div>
</template>

<style scoped>
.loading {
  padding: 40px;
  text-align: center;
}

.hero-banner {
  background-size: cover;
  background-position: center;
  color: #ffffff;
  padding: 40px 20px;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
}

.poster-container {
  width: 260px;
  flex-shrink: 0;
}

.poster-box img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

.meta-content {
  flex: 1;
}

.title {
  font-size: 2.2rem;
  margin: 0 0 10px;
}

.year {
  font-weight: 300;
  color: #cbd5e1;
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.score-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-circle {
  width: 48px;
  height: 48px;
  background: #081c22;
  border: 3px solid #21d07a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tagline {
  font-style: italic;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.overview h3 {
  margin: 0 0 6px;
}

.overview p {
  line-height: 1.5;
  color: #e2e8f0;
}

.cast-section {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.cast-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
}
</style>