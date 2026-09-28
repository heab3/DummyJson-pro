// import { createRouter, createWebHistory } from 'vue-router'

// import Home from '../views/Home.vue'
// import Movies from '../views/Movies.vue'
// import TVShows from '../views/TVShows.vue'
// import About from '../views/About.vue'

// import MovieDetail from '../components/MovieDetail.vue'

// const router = createRouter({
//   history: createWebHistory(),

//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component: Home
//     },

//     {
//       path: '/movies',
//       name: 'Movies',
//       component: Movies
//     },

//     {
//       path: '/tv-shows',
//       name: 'TVShows',
//       component: TVShows
//     },

//     {
//       path: '/about',
//       name: 'About',
//       component: About
//     },

//     {
//       path: '/movie/:id',
//       name: 'MovieDetail',
//       component: MovieDetail
//     }
//   ]
// })

// export default router




import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Movies from '../views/Movies.vue'
import TVShows from '../views/TVShows.vue'
import About from '../views/About.vue'
import MovieDetail from '../views/MovieDetail.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/tv-shows', name: 'TVShows', component: TVShows },
  { path: '/about', name: 'About', component: About },
  { 
    path: '/movie/:id', 
    name: 'MovieDetail', 
    component: MovieDetail, 
    props: { type: 'movie' } 
  },
  { 
    path: '/tv/:id', 
    name: 'TVDetail', 
    component: MovieDetail, 
    props: { type: 'tv' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router