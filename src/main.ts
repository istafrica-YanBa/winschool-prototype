import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import './style.css'

// --- PrimeVue and CommonUI integration ---
import PrimeVue from 'primevue/config'
import CommonUI from '@ist/commonui-components'
// import '@ist/commonui-components/dist/assets/style.css' // Removed because file does not exist
// If you have a theme or overrides, import them as well:
// import '@ist/commonui-components/dist/assets/primevue-overrides.css'
// import '@ist/commonui-components/dist/assets/your-theme.css'
// ----------------------------------------

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(PrimeVue, { unstyled: true }) // Register PrimeVue globally, unstyled
app.use(CommonUI) // Register all @ist/commonui-components globally
app.mount('#app')