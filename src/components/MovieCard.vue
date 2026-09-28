

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: { type: Object, required: true },
  type: { type: String, default: 'movie' }
})

const title = computed(() => props.movie.title || props.movie.name)

const formattedDate = computed(() => {
  const dateStr = props.movie.release_date || props.movie.first_air_date
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const posterUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster'
)
</script>

<template>
  <div class="card">
    <RouterLink :to="`/${type}/${movie.id}`" class="card-link">
      <div class="poster-box">
        <img :src="posterUrl" :alt="title" loading="lazy" />
        <button class="options-btn" @click.prevent.stop>•••</button>
      </div>

      <div class="card-info">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-date">{{ formattedDate }}</p>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-link {
  text-decoration: none;
  color: #000;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.poster-box {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  background-color: #cbd5e1;
}

.poster-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.options-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #000;
}

.card-info {
  padding: 10px;
}

.card-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: bold;
  color: #000;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #666;
}
</style>