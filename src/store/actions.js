import axios from 'axios'

const PER_PAGE = 50

export const actions = {
    fetchSiteMeta(store) {
        const baseUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${store.state.site.wpSite}`
        axios.get(`${baseUrl}/`)
            .then(response => {
                store.commit('updateSiteMeta', response.data)
                store.dispatch('updateHeadMeta')
            })
    },
    updateHeadMeta(store, page = 'home') {
        let pageTitle = `${store.getters.getSiteConfig('siteTitle')} | ${store.getters.getSiteConfig('tagline')}`;
        let description = store.getters.getSiteConfig('tagline');
        let image = store.getters.getSiteConfig('image');
        let author = store.getters.getSiteConfig('siteAuthor');

        if (page.params && page.params.slug) {
            const post = store.getters.getBySlug(page.params)
            author = post.author ? post.author.name : author;
            description = post ? `${post.title}, ${Object.keys(post.tags).join(', ')}` : description;
            image = `${post.featured_image}?w=400&h=400&crop=1`
        }

        document.title = pageTitle;
        const tagDescription = document.querySelector('meta[name="description"]')
        if (tagDescription) {
            tagDescription.setAttribute("content", description);
        }
        const tagAuthor = document.querySelector('meta[name="author"]')
        if (tagAuthor) {
            tagAuthor.setAttribute("content", author);
        }
        const tagTwitterSite = document.querySelector('meta[name="twitter:site"]')
        if (tagTwitterSite) {
            tagTwitterSite.setAttribute("content", store.getters.getSiteConfig('twitter'));
        }
        const tagTwitterCreator = document.querySelector('meta[name="twitter:creator"]')
        if (tagTwitterCreator) {
            tagTwitterCreator.setAttribute("content", store.getters.getSiteConfig('twitter'));
        }
        const tagTwitterDescription = document.querySelector('meta[name="twitter:description"]')
        if (tagTwitterDescription) {
            tagTwitterDescription.setAttribute("content", description);
        }
        const tagTwitterImage = document.querySelector('meta[name="twitter:image"]')
        if (tagTwitterImage) {
            tagTwitterImage.setAttribute("content", image);
        }
    },
    fetchAllPosts(store, attr = {page: 0, page_per: PER_PAGE, type: 'post'}) {
        const baseUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${store.state.site.wpSite}`
        axios.get(`${baseUrl}/posts?page=${attr.page}&number=${attr.page_per}&type=${attr.type}`)
            .then(response => {
                const currentPostCount = Object.keys(store.state.post).length;
                store.commit('addPosts', response.data.posts, attr.type)
                store.commit('updateFound', response.data.found)
                store.commit('fetching', false);
                if (currentPostCount + response.data.posts.length <= response.data.found && 0 < response.data.posts.length) {
                    store.dispatch('fetchAllPosts', {page: attr.page + 1, page_per: attr.page_per, type: attr.type});
                } else {
                    store.commit('updateLastUpdated')
                    store.dispatch("hideStatic")
                }
            })
    },
    fetchBySlug(store, slug) {
        let re = new RegExp('^\\/[0-9]{4}\\/[0-9]{2}\\/(.+)\\/')
        const match = slug.match(re)
        if (match && match.length === 2) {
            const baseUrl = `https://public-api.wordpress.com/wp/v2/sites/${store.state.site.wpSite}`
            axios.get(`${baseUrl}/posts?slug=${match[1]}`)
                .then(response => {
                    store.commit('addPosts', response.data)
                    store.dispatch("hideStatic")
                    store.commit('fetching', false)
                })
        }
    },
    fetchAllPages(store) {
        store.dispatch('fetchAllPosts', {page: 0, type: 'page'});
    },
    fetchAllTestimonials(store) {
        store.dispatch('fetchAllPosts', {page: 0, type: 'jetpack-testimonial'});
    },
    getTraverseCategories(store) {
        axios.get(`https://public-api.wordpress.com/wp/v2/sites/${store.state.site.wpSite}/categories?parent=${store.state.site.traverseID}`)
            .then(response => {
                const ids = response.data.map(category => category.id)
                ids.push(store.state.site.traverseID)
                store.commit('setTraverseCategories', ids)
            })
    },
    strip(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    },
    hideStatic() {
        const staticElem = document.getElementById("static")
        if (staticElem) {
            staticElem.innerHTML = '';
        }
    }
}
