<!-- <script setup>
defineProps({
  cast: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="cast-section">
    <h2>Cast</h2>

    <div class="cast-grid">
      <div
        v-for="person in cast.slice(0, 10)"
        :key="person.id"
        class="cast-card"
      >
        <img
          v-if="person.profile_path"
          :src="`https://image.tmdb.org/t/p/w300${person.profile_path}`"
          :alt="person.name"
        />

        <h3>{{ person.name }}</h3>

        <p>{{ person.character }}</p>
      </div>
    </div>
  </section>
</template> -->

<script setup>
import { computed } from 'vue'

const props = defineProps({
  actor: { type: Object, required: true }
})

const profileUrl = computed(() =>
  props.actor.profile_path
    ? `https://image.tmdb.org/t/p/w185${props.actor.profile_path}`
    : 'https://via.placeholder.com/185x278?text=No+Image'
)
</script>

<template>
  <div class="cast-card">
    <img :src="profileUrl" :alt="actor.name" loading="lazy" />
    <div class="cast-info">
      <h4>{{ actor.name }}</h4>
      <p>{{ actor.character }}</p>
    </div>
  </div>
</template>

<style scoped>
.cast-card {
  width: 130px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e3e3e3;
}

.cast-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.cast-info {
  padding: 8px;
}

.cast-info h4 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: bold;
  color: #000;
}

.cast-info p {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #666;
}
</style>