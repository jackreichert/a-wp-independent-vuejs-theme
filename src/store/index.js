import {createStore} from 'vuex'
import {state} from './state'
import {getters} from './getters'
import {actions} from "./actions";
import {mutations} from "./mutations";

export const store = createStore({
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
})
