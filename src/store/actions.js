import axios from 'axios'

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
        document.querySelector('meta[name="description"]').setAttribute("content", description);
        document.querySelector('meta[name="author"]').setAttribute("content", author);
        document.querySelector('meta[name="twitter:site"]').setAttribute("content", store.getters.getSiteConfig('twitter'));
        document.querySelector('meta[name="twitter:creator"]').setAttribute("content", store.getters.getSiteConfig('twitter'));
        document.querySelector('meta[name="twitter:site"]').setAttribute("content", pageTitle);
        document.querySelector('meta[name="twitter:description"]').setAttribute("content", description);
        document.querySelector('meta[name="twitter:image"]').setAttribute("content", image);
    },
    fetchAllPosts(store, attr = {page: 0, page_per: 20, type: 'post'}) {
        const baseUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${store.state.site.wpSite}`
        axios.get(`${baseUrl}/posts?page=${attr.page}&per_page=${attr.page_per}&type=${attr.type}`)
            .then(response => {
                const currentPostCount = Object.keys(store.state.post).length;
                store.commit('addPosts', response.data.posts, attr.type)
                store.commit('updateFound', response.data.found)
                store.commit('fetching', false);
                if (currentPostCount + response.data.posts.length <= response.data.found) {
                    store.dispatch('fetchAllPosts', {page: attr.page + 1, page_per: attr.page_per, type: attr.type});
                } else {
                    store.commit('updateLastUpdated')
                }
            })
    },
    fetchAllPages(store) {
        store.dispatch('fetchAllPosts', {page: 0, page_per: 20, type: 'page'});
    },
    fetchAllTestimonials(store) {
        store.dispatch('fetchAllPosts', {page: 0, page_per: 20, type: 'jetpack-testimonial'});
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
    }
    //https://public-api.wordpress.com/rest/v1.1/sites/jackreichert.wordpress.com/posts?type=jetpack-testimonial
    //https://public-api.wordpress.com/wp/v2/sites/jackreichert.wordpress.com/
}
