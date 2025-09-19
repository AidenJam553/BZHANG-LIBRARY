// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

// Firebase imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPSsnjAGKPmVrozmRxkwo9oVN-5-26cww",
  authDomain: "week7-bohan.firebaseapp.com",
  projectId: "week7-bohan",
  storageBucket: "week7-bohan.firebasestorage.app",
  messagingSenderId: "368487008004",
  appId: "1:368487008004:web:764266ea6d34203b283251"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')
