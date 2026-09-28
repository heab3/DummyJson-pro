<!-- 
<template>
  <nav class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="logo">MOVIES API</RouterLink>
      <div class="links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/movies">Movies</RouterLink>
        <RouterLink to="/tv-shows">TV Shows</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        

      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #032541;
  padding: 16px 24px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #01b4e4;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
}

.links a.router-link-exact-active {
  color: #01b4e4;
}
</style> -->

<template>
  <nav class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="logo">MOVIES API</RouterLink>
      
      <div class="links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/movies">Movies</RouterLink>
        <RouterLink to="/tv-shows">TV Shows</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <!-- Search Bar by Title -->
        <div 
          ref="searchContainer" 
          class="search-box" 
          :class="{ 'expanded': isSearchOpen }"
        >
          <button 
            type="button" 
            class="search-icon-btn" 
            aria-label="Search"
            @click="toggleSearch" 
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search by title..."
            class="search-input"
            @input="onInput"
            @keyup.enter="triggerSearch"
            @keyup.esc="closeSearch"
          />

          <button 
            v-if="searchQuery" 
            type="button" 
            class="clear-icon-btn" 
            @click="clearSearch"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const searchContainer = ref(null)
let debounceTimer = null

// Keep search input in sync if user navigates via URL (e.g. /search?q=batman)
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery
    isSearchOpen.value = true
  }
}, { immediate: true })

const toggleSearch = () => {
  if (isSearchOpen.value && searchQuery.value === '') {
    isSearchOpen.value = false
  } else {
    isSearchOpen.value = true
    nextTick(() => searchInput.value?.focus())
  }
}

const closeSearch = () => {
  isSearchOpen.value = false
  clearSearch()
}

const triggerSearch = () => {
  const query = searchQuery.value.trim()
  if (query.length > 0) {
    router.push({ path: '/search', query: { q: query } })
  }
}

const onInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const query = searchQuery.value.trim()
    if (query.length > 0) {
      router.push({ path: '/search', query: { q: query } })
    } else if (route.path === '/search') {
      router.push('/')
    }
  }, 400)
}

const clearSearch = () => {
  searchQuery.value = ''
  if (route.path === '/search') {
    router.push('/')
  }
  if (isSearchOpen.value) {
    searchInput.value?.focus()
  }
}

const handleClickOutside = (event) => {
  if (
    searchContainer.value && 
    !searchContainer.value.contains(event.target) && 
    searchQuery.value === ''
  ) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: #032541;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #01b4e4;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.links a:hover,
.links a.router-link-exact-active {
  color: #01b4e4;
}

/* Search Box Custom Styles */
.search-box {
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.search-box.expanded {
  background: rgba(255, 255, 255, 0.1);
  border-color: #01b4e4;
}

.search-icon-btn,
.clear-icon-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  transition: color 0.2s ease;
}

.search-icon-btn:hover {
  color: #01b4e4;
}

.search-input {
  width: 0;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  transition: width 0.3s ease, opacity 0.3s ease;
  padding: 0;
}

.search-box.expanded .search-input {
  width: 180px;
  opacity: 1;
  padding: 0 8px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon-btn {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon-btn:hover {
  color: #ffffff;
}
</style>