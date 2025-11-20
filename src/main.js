import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'

const vuetify = createVuetify({
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
})

//firebase
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt88F8xAQVaHS3SdcqswoLux4jhBJgmbk",
  authDomain: "surprisedialog-experiment.firebaseapp.com",
  databaseURL: "https://surprisedialog-experiment-default-rtdb.firebaseio.com",
  projectId: "surprisedialog-experiment",
  storageBucket: "surprisedialog-experiment.firebasestorage.app",
  messagingSenderId: "665936788418",
  appId: "1:665936788418:web:33922ef4d72ac02b15745b"
};

// Initialize Firebase
initializeApp(firebaseConfig);

//sweet alert
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)
app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
