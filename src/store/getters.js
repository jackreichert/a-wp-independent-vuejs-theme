export const getters = {
    getSiteConfig: (state) => (configKey) => {
        return state.site[configKey]
    },
    getBySlug: (state) => (slug) => {
        for (const key in state.post) {
            if (state.post[key].slug === slug) {
                return state.post[key]
            }
        }
        console.log("page", state.page)
        for (const key in state.page) {
            if (state.page[key].slug === slug) {
                return state.page[key]
            }
        }
        return false
    },
    orderByDate: (state) => (type) => {
        return Object.keys(state[type]).sort((keyA, keyB) => {
            return state[type][keyA].date < state[type][keyB].date
        })
    },
    getPostsInCategory: (state) => (category) => {
        let postKeys = Object.keys(state.post)
        return postKeys.filter(key => {
            const categories = Object.keys(state.post[key].categories)
            for (let i = 0; i < categories.length; i++) {
                let cat = categories[i]
                if (state.post[key].categories[cat].slug === category) {
                    return true
                }
            }
            return false
        })
    },
    getPostsInTag: (state) => (tag) => {
        let postKeys = Object.keys(state.post)
        return postKeys.filter(key => {
            const tags = Object.keys(state.post[key].tags)
            for (let i = 0; i < tags.length; i++) {
                if (state.post[key].tags[tags[i]].slug === tag) {
                    return true
                }
            }
            return false
        })
    },
    getPostsForPage: (state, getters) => (params) => {
        const pageNum = params.pageNum || 0
        const start = pageNum * state.site.perPage;
        let postKeys = getters.orderByDate('post')
        if ('undefined' !== typeof params.category) {
            postKeys = getters.getPostsInCategory(params.category)
        }
        if ('undefined' !== typeof params.tag) {
            postKeys = getters.getPostsInTag(params.tag)
        }
        const ids = postKeys.slice(start, start + state.site.perPage)
        const posts = {}
        ids.forEach(id => {
            posts[id] = state.post[id]
        })
        return posts
    },
    getTestimonials: (state, getters) => () => {
        const testimonialIds = getters.orderByDate('jetpack-testimonial')
        let testimonials = {}
        testimonialIds.forEach(id => {
            testimonials[id] = state['jetpack-testimonial'][id]
        })
        return testimonials
    },
    getPreviousPageLink: (state) => (pageNum = '0') => {
        const perPage = state.site.perPage
        pageNum = parseInt(pageNum)
        const postKeysLength = Object.keys(state.post).length
        const newPageNum = (postKeysLength - pageNum * perPage) > perPage ? pageNum + 1 : pageNum
        return newPageNum === pageNum ? '/' : `/page/${newPageNum}`
    },
    getNextPageLink: (state) => (pageNum = '0') => {
        pageNum = parseInt(pageNum)
        const newPageNum = pageNum + 1
        return newPageNum > 1 ? `/page/${newPageNum}` : '/'
    },
    getPreviousPost: (state, getters) => (postId = '0') => {
        const keys = getters.orderByDate('post')
        const index = keys.indexOf(`post-${postId}`)
        return index < keys.length ? state.post[keys[index + 1]].URL.split(state.site.wpSite)[1] : '/'
    },
    getNextPost: (state, getters) => (postId = '0') => {
        const keys = getters.orderByDate('post')
        const index = keys.indexOf(`post-${postId}`)
        return index > 0 ? state.post[keys[index - 1]].URL.split(state.site.wpSite)[1] : '/'
    },
    getPageMenu: (state) => () => {
        const keys = Object.keys(state.page)
        return keys.map(key => {
            console.log(state.page[key])
            return {
                title: state.page[key].title,
                path: `/${state.page[key].slug}`
            }

        })
    }
}
