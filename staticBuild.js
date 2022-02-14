const fs = require('fs')
const bent = require('bent')
const config = require('./src/site.config.json')

const SITE = `https://${config.homepage}`

function save(post, filename, pathname) {
    try {
        const dir = `./dist${pathname}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }

        fs.readFile('./dist/index.html', 'utf8', function (err, data) {
            if (err) {
                return console.error(err);
            }
            const content = data.replace(/<section id="app"><\/section>/g, `<section id="app"><h1>${post.title}</h1><article>${post.content}</article></section>`);

            fs.writeFileSync(`${dir}index.html`, content, 'utf8', function (err) {
                if (err) return console.error(err);
            });
        });

        fs.appendFile('./dist/sitemap.txt', SITE + pathname + "\n", function (err) {
            if (err) throw err;
        });
        console.log(`${dir} written successfully`)
    } catch (err) {
        console.error(err)
    }
}

async function getAllPosts(site, attr = {page: 0, page_per: 50, type: 'post'}, posts = []) {
    console.log(`fetching page ${attr.page}`)
    const getJSON = bent('json')
    const currentPostCount = posts.length
    const baseUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${site}/posts`
    let res = await getJSON(`${baseUrl}?page=${attr.page}&number=${attr.page_per}&type=${attr.type}`)
    const joined = posts.concat(res.posts)
    if (currentPostCount + res.posts.length < res.found && 0 < res.posts.length) {
        return getAllPosts(site, {page: attr.page + 1, page_per: attr.page_per, type: attr.type}, joined);
    } else {
        return joined
    }
}

function removeTraversed(posts) {
    let blogposts = {}
    posts.forEach(post => {
        let is_traverse = false
        const cats = Object.keys(post.terms.category)
        cats.forEach(cat => {
            if ('parent' in post.terms.category[cat] && post.terms.category[cat].parent === config.traverseID) {
                is_traverse = true
            }
        })
        if (!is_traverse) {
            blogposts[`post_${post.ID}`] = post
        }
    })
    console.log(`Found: ${Object.keys(blogposts).length} posts of ${posts.length}`)
    return blogposts;
}

const getPathname = function (date, slug, type) {
    if (type === 'page') {
        return `/${slug}/`
    }

    const postDate = new Date(date)
    return `/${postDate.getFullYear()}/${('0' + (parseInt(postDate.getMonth()) + 1)).slice(-2)}/${slug}/`
}

const writeEverything = function (postsPromise) {
    postsPromise.then(posts => {
        let blogposts = (posts[0].type === 'post') ? removeTraversed(posts) : posts;
        var i = 0;
        const ids = Object.keys(blogposts)
        while (i < ids.length) {
            (function (i) {
                const post = blogposts[ids[i]]
                const url = new URL(post.URL)
                const pathname = getPathname(post.date, post.slug, post.type)
                save(post, post.slug, pathname)
            })(i++)
        }
    })
}

const posts = getAllPosts(config.wpSite)
writeEverything(posts)

const pages = getAllPosts(config.wpSite, {page: 0, page_per: 50, type: 'page'})
writeEverything(pages)
