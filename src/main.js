import 'ghspa';
import {createApp} from 'vue'
import App from './App.vue'
import {store} from './store'
import {router} from './router'
import './style/index.scss'
import VueGtag from "vue-gtag-next";
import config from './site.config.js'

store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
});

const app = createApp(App).use(store).use(router);

if (!window.location.href.includes('localhost') && "gtag" in config && config.gtag !== "") {
    app.use(VueGtag, {
        property: {
            id: config.gtag
        }
    });
}
app.mount('#app');
