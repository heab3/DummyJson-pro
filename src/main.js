// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import './style.css'

// createApp(App)
//   .use(router)
//   .mount('#app')


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')