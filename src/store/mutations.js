import moment from 'moment'
import config from './../site.config.js'

export const mutations = {
    setSiteConfig(state) {
        Object.keys(config).forEach(key => {
            state.site[key] = config[key]
        })

    },
    updateLastUpdated(state) {
        state.lastUpdated = moment().format();
    },
    addPosts(state, newPosts) {
        for (var i = 0; i < newPosts.length; i++) {
            let isTraverse = false;
            if (state.traverseIds.length) {
                const catNames = Object.keys(newPosts[i].categories)
                const catIds = catNames.map(name => newPosts[i].categories[name].ID)
                state.traverseIds.forEach(traverseId => {
                    if (catIds.indexOf(traverseId) >= 0) {
                        state.traverse[`post-${newPosts[i].ID}`] = newPosts[i]
                        isTraverse = true;
                    }
                })
            }
            if (!isTraverse) {
                state[newPosts[i].type][`post-${newPosts[i].ID}`] = newPosts[i]
            }
        }
    },
    updateSiteMeta(state, siteMeta) {
        state.site.siteTitle = siteMeta.name
        state.site.tagline = siteMeta.description
    },
    updateFound(state, found) {
        state.found = found
    },
    getInitialiseStore(state) {
        // Check if the ID exists
        if (localStorage.getItem('store')) {
            console.log("FOUND Storage")
            this.replaceState(
                Object.assign(state, JSON.parse(localStorage.getItem('store')))
            );

        }
    },
    setTraverseCategories(state, ids) {
        state.traverseIds = ids
    }

}
