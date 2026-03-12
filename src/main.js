import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()   // on appelle bien la fonction

app.use(pinia)                // pas "user"
app.use(router)

app.mount('#app')
