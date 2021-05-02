import moment from 'moment';

export const getters = {
    getSiteConfig: (state) => (configKey) => {
        return state.site[configKey]
    },
    getBySlug: (state) => ({slug}) => {
        const postTypes = ['post', 'page']
        let post = false
        postTypes.forEach(postType => {
            for (const key in state[postType]) {
                if (state[postType][key].slug === slug) {
                    post = state[postType][key]
                }
            }
        })
        return post;
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
    getTraversePosts: (state, getters) => () => {
        const posts = {}
        let postKeys = getters.orderByDate('traverse')
        postKeys.forEach(id => {
            let category = Object.keys(state.traverse[id].categories).filter(key => key.toLowerCase() !== 'traverse')[0]
            if (!posts[category] || posts[category].date < state.traverse[id].date) {
                posts[category] = state.traverse[id]
            }
        })
        return posts
    },
    getPostsForRoute: (state, getters) => (params) => {
        const posts = {}
        if ('undefined' !== typeof params.slug) {
            const post = getters.getBySlug(params)
            return post ? [post] : []
        }
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
        const day = 'undefined' !== typeof state.post[keys[index + 1]] ? moment(state.post[keys[index + 1]].date).date() : '';
        return index < keys.length && 'undefined' !== typeof state.post[keys[index + 1]] ? state.post[keys[index + 1]].URL.split(state.site.wpSite)[1].replace(`/${day}/`, '/') : '/'
    },
    getNextPost: (state, getters) => (postId = '0') => {
        const keys = getters.orderByDate('post')
        const index = keys.indexOf(`post-${postId}`)
        let url = index > 0 ? state.post[keys[index - 1]].URL.split(state.site.wpSite)[1] : '/'
        const day = state.post[keys[index - 1]] ? moment(state.post[keys[index - 1]].date).date() : ''
        url = url.replace(`/${day}/`, '/');
        return url;
    },
    getPageMenu: (state) => () => {
        const keys = Object.keys(state.page)
        return keys.map(key => {
            return {
                title: state.page[key].title,
                path: `/${state.page[key].slug}`
            }

        })
    }
}
