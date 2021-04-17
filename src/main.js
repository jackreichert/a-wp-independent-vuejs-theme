import {createApp} from 'vue'
import App from './App.vue'
import {store} from './store'
import {router} from './router'
import './style/index.scss'

store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
});

createApp(App).use(store).use(router).mount('#app')
