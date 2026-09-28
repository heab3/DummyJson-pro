<template>
  <nav class="netflix-navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-left">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
        alt="Netflix" 
        class="nav-logo" 
      />
      <ul class="nav-links">
        <li class="active">Home</li>
        <li>TV Shows</li>
        <li>Movies</li>
        <li>New & Popular</li>
        <li>My List</li>
      </ul>
    </div>

    <div class="nav-right">
      <!-- Expanding Search Box -->
      <div 
        ref="searchContainer"
        class="search-box" 
        :class="{ 'expanded': isSearchOpen }"
      >
        <button 
          class="search-icon-btn" 
          @click="toggleSearch" 
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Titles, people, genres"
          class="search-input"
          @input="onInput"
          @keyup.esc="closeSearch"
        />

        <button 
          v-if="searchQuery" 
          class="clear-icon-btn" 
          @click="clearSearch"
        >
          &times;
        </button>
      </div>

      <span class="nav-item">Kids</span>
      <div class="profile-avatar">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['search', 'clear'])

const isScrolled = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const searchContainer = ref(null)
let debounceTimer = null

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

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

const onInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim().length > 0) {
      emit('search', searchQuery.value.trim())
    } else {
      emit('clear')
    }
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
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
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.netflix-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4%;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 10%, transparent);
  transition: background-color 0.4s ease;
}

.netflix-navbar.scrolled {
  background-color: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(8px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-logo {
  height: 25px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 18px;
  margin: 0;
  padding: 0;
}

.nav-links li {
  color: #e5e5e5;
  font-size: 14px;
  cursor: pointer;
}

.nav-links li:hover,
.nav-links li.active {
  color: #ffffff;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #ffffff;
}

.search-box {
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  padding: 3px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border-radius: 2px;
}

.search-box.expanded {
  background: rgba(0, 0, 0, 0.85);
  border-color: #ffffff;
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
  padding: 4px 6px;
}

.search-input {
  width: 0;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
  padding: 0;
}

.search-box.expanded .search-input {
  width: 210px;
  opacity: 1;
  padding: 0 8px;
}

.clear-icon-btn {
  font-size: 18px;
  color: #aaaaaa;
}

.profile-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
</style>