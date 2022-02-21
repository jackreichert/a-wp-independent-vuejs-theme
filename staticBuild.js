const fs = require('fs')
const bent = require('bent')
const config = require('./src/site.config.json')
const striptags = require('striptags');

const SITE = `https://${config.homepage}`

function save(post, filename, pathname, index) {
    try {
        const dir = `./dist${pathname}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }

        let content = index.replace(/<\/body>/g, `<section id="static"><article class="entry"><header><h1>${post.title}</h1></header><div class="entry-content">${post.content}</div></article></section></body>`);
        content = content.replace(/<title>A WordPress Independent Theme<\/title>/g, `<title>${config.siteAuthor} | ${post.title}</title>`)
        // content = content.replace(/<meta name="description" content="This site runs WordPress content, without hosting a WordPress site." \/>/g, `<meta name="description" content="${getExcerpt(post.excerpt)}" />"`)
        content = content.replace(/<meta name="author" content="" \/>/g, `<meta name="author" content="${config.siteAuthor}" />`)

        content = content.replace(/<!-- twitter card tags -->/g, getTwitterCard(post))
        content = content.replace(/<!-- Global site tag - Google Analytics -->/g, getGTAG())
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

function getTwitterCard(post) {
    return `<!-- twitter card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${config.twitter}" />
    <meta name="twitter:creator" content="${config.twitter}" />
    <meta name="twitter:title" content="${config.siteAuthor} | ${post.title}" />
    <meta name="twitter:description" content="${getExcerpt(post.excerpt)}" />
    <meta name="twitter:image" content="${post.featured_image}?w=1200&h=900&crop=1" />`
}

function getExcerpt(excerpt) {
    return striptags(excerpt).substring(0, 150)
}

function getGTAG() {
    return `<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.gtag}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${config.gtag}');
    </script>`
}

function savePostsToHome(posts, index) {
    const title = `${config.siteAuthor} | ${config.siteDescription}`
    let content = '<section id="static">';
    posts.forEach(post => {
        content += `<article class="entry"><header><h1><a href="${post.url}">${post.title}</a></h1></header><div class="entry-content">${post.excerpt}</div></article>`
    })
    content += "</section></body>"
    content = index.replace(/<\/body>/g, content);

    content = content.replace(/<!-- Global site tag - Google Analytics -->/g, getGTAG())
    content = content.replace(/<meta name="author" content="" \/>/g, `<meta name="author" content="${config.siteAuthor}" />`)
    content = content.replace(/<title>A WordPress Independent Theme<\/title>/g, `<title>${title}</title>`)

    const post = {
        "title": title,
        "excerpt": `Thoughts and musings of ${config.siteAuthor}`,
        "featured_image": config.homeImage
    }
    content = content.replace(/<!-- twitter card tags -->/g, getTwitterCard(post))

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
                paths.push({"title": post.title, "url": pathname, "excerpt": post.excerpt.substring(0, 150)})
                save(post, post.slug, pathname, index)
            })(i++)
        }

        savePostsToHome(paths, index)
    })
}

fs.readFile('./dist/index.html', 'utf8', function (err, index) {
    if (err) {
        return console.error(err);
    }
    const posts = getAllPosts(config.wpSite)
    writeEverything(posts, index)

    const pages = getAllPosts(config.wpSite, {page: 0, page_per: 50, type: 'page'})
    writeEverything(pages, index)
});

