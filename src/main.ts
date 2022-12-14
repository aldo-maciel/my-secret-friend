import {createApp} from 'vue'
import './style.css'
import 'css.gg/icons/all.css';
// Vuetify
import 'vuetify/styles'
import 'vite/modulepreload-polyfill'
import App from './App.vue'

import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'

const vuetify = createVuetify({
  components
})

createApp(App).use(vuetify).mount('#app')
