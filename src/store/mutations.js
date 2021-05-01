import moment from 'moment'
import config from './../site.config.js'

const mapV2toV11 = (post) => {
    const newPost = post;
    newPost['ID'] = post.id;
    newPost.content = post.content.rendered;
    newPost.excerpt = post.excerpt.rendered;
    newPost.title = post.title.rendered;
    newPost.featured_image = '';
    newPost.author = {"name": ""};
    newPost.URL = post.link;
    newPost.categories = [];
    newPost.tags = [];
    return newPost;
}

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
                const newPost = 'undefined' !== typeof newPosts[i]['ID'] ? newPosts[i] : mapV2toV11(newPosts[i])
                state[newPost.type][`post-${newPost.ID}`] = newPost
            }
        }
    },
    updateSiteMeta(state, siteMeta) {
        state.site.siteTitle = siteMeta.name
        state.site.tagline = siteMeta.description
        state.site.image = siteMeta.icon.img.replace('?w=96', '?w=400')
    },
    updateFound(state, found) {
        state.found = found
    },
    getInitialiseStore(state) {
        // Check if the ID exists
        if (localStorage.getItem('store')) {
            this.replaceState(
                Object.assign(state, JSON.parse(localStorage.getItem('store')))
            );

        }
    },
    setTraverseCategories(state, ids) {
        state.traverseIds = ids
    },
    fetching(state, status) {
        state.isLoading = status
    }
}
