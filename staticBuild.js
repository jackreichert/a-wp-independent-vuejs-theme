const fs = require('fs')
const bent = require('bent')
const config = require('./src/site.config.json')

const SITE = `https://${config.homepage}`

function save(post, filename, pathname, index) {
    try {
        const dir = `./dist${pathname}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }

        let content = index.replace(/<\/body>/g, `<section id="static"><article class="entry"><header><h1>${post.title}</h1></header><div class="entry-content">${post.content}</div></article></section></body>`);
        content = content.replace(/<title>A WordPress Independent Theme<\/title>/g, `<title>${config.siteAuthor} | ${post.title}</title>`)
        content = content.replace(/<meta name="twitter:title" content="Jack Reichert" \/>/g, `<meta name="twitter:title" content="${config.siteAuthor} | ${post.title}" />`)
        fs.writeFileSync(`${dir}index.html`, content, 'utf8', function (err) {
            if (err) return console.error(err);
        });

        fs.appendFile('./dist/sitemap.txt', SITE + pathname + "\n", function (err) {
            if (err) throw err;
        });
        console.log(`${dir} written successfully`)
    } catch (err) {
        console.error(err)
    }
}

function savePostsToHome(paths, index) {
    let content = '';
    paths.forEach(path => {
        content += `<article><h1><a href="${path.url}">${path.title}</a></h1></article>`
    })
    content += "</section>"
    content = index.replace(/<\/section>/g, content);

    fs.writeFileSync('./dist/index.html', content, 'utf8', function (err) {
        if (err) return console.error(err);
    });
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

const writeEverything = function (postsPromise, index) {
    postsPromise.then(posts => {
        let blogposts = (posts[0].type === 'post') ? removeTraversed(posts) : posts;
        var i = 0;
        let paths = []
        const ids = Object.keys(blogposts)
        while (i < ids.length) {
            (function (i) {
                const post = blogposts[ids[i]]
                const pathname = getPathname(post.date, post.slug, post.type)
                paths.push({"title": post.title, "url": pathname})
                save(post, post.slug, pathname, index)
            })(i++)
        }

        savePostsToHome(paths, index)
    })
}

fs.readFile('./dist/index.html', 'utf8', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const posts = getAllPosts(config.wpSite)
    writeEverything(posts, data)

    const pages = getAllPosts(config.wpSite, {page: 0, page_per: 50, type: 'page'})
    writeEverything(pages, data)
});

