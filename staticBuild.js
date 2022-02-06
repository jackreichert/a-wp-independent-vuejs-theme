const puppeteer = require('puppeteer')
const fs = require('fs')
const bent = require('bent')
const config = require('./src/site.config.json')

const SITE = `https://${config.homepage}`


async function ssr(url) {
    console.log(`getting page ${url}`)
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle0'})
    const html = await page.content() // serialized HTML of page DOM.
    await browser.close()
    return html
}

function save(content, filename, pathname) {
    try {
        const dir = `./dist${pathname}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }

        fs.writeFileSync(`${dir}index.html`, content)
        fs.appendFile('./dist/sitmap.txt', SITE + pathname + "\n", function (err) {
            if (err) throw err;
            console.log('Saved!');
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

const posts = getAllPosts(config.wpSite)
posts.then(posts => {
    let blogposts = removeTraversed(posts);

    var i = 0;
    const ids = Object.keys(blogposts)
    while (i < ids.length) {
        (function (i) {
            setTimeout(function () {
                const post = blogposts[ids[i]]
                const url = new URL(post.URL)
                const response = ssr(`${SITE}${url.pathname}`)
                response.then(content => save(content, post.slug, url.pathname))
            }, 1500 * i)
        })(i++)
    }
})

const pages = getAllPosts(config.wpSite, {page: 0, page_per: 50, type: 'page'})
pages.then(pages => {
    let i = 0;
    let ids = []
    while (i < pages.length) {
        (function (i) {
            setTimeout(function () {
                const page = pages[i]
                if (!ids.includes(page.ID)) {
                    ids.push(page.ID)
                    const url = new URL(page.URL)
                    const pathname = url.pathname !== '/' ? url.pathname : `/${page.slug}/`
                    const response = ssr(`${SITE}${pathname}`)
                    response.then(content => save(content, page.slug, pathname))
                }
            }, 1500 * i)
        })(i++)
    }
})
