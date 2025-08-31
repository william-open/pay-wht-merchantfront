import { createApp } from 'vue'
import App from './App.vue'
import install from './install'
import './permission'
import './styles/index.scss'
import 'virtual:svg-icons-register'
// import { createPinia } from 'pinia'


const app = createApp(App)
app.use(install)
// app.use(createPinia())
app.mount('#app')
