let GITHUB_USER = 'divpreeet'
let activeSection = null

const BUTTONS = [
    { file: null, custom: true, text: 'NETFLIX', bg: '#e50914', fg: '#fff', url: 'https://netflix.divpreet.org' },
    { file: null, custom: true, text: 'PAPERS', bg: '#f5f0e0', fg: '#2d2420', url: 'https://papers.divpreet.org' },
    { file: 'anybrowser.gif', alt: 'Best viewed with any browser', url: 'https://anybrowser.org/campaign/' },
    { file: 'construction.gif', alt: 'Under construction', url: null },
    { file: 'html5.png', alt: 'HTML5', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { file: 'css3.gif', alt: 'CSS3', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { file: 'archlinux.gif', alt: 'Arch Linux', url: 'https://archlinux.org/' },
    { file: 'gnu-linux.gif', alt: 'GNU/Linux', url: 'https://www.gnu.org/' },
    { file: 'debian-powered.gif', alt: 'Debian', url: 'https://www.debian.org/' },
    { file: 'getfirefox.gif', alt: 'Get Firefox', url: 'https://www.mozilla.org/firefox/' },
    { file: 'php_powered.gif', alt: 'PHP', url: 'https://www.php.net/' },
    { file: 'madewithlove.gif', alt: 'Made with love', url: null },
    { file: 'notepadpp.gif', alt: 'Notepad++', url: 'https://notepad-plus-plus.org/' },
    { file: 'sublime.png', alt: 'Sublime Text', url: 'https://www.sublimetext.com/' },
    { file: 'written-in-vi.gif', alt: 'Written in vi', url: 'https://www.vim.org/' },
    { file: 'w3schools88x31.gif', alt: 'W3Schools', url: 'https://www.w3schools.com/' },
    { file: 'wikipedia.gif', alt: 'Wikipedia', url: 'https://www.wikipedia.org/' },
    { file: 'gimp.gif', alt: 'GIMP', url: 'https://www.gimp.org/' },
    { file: 'vscbutton.gif', alt: 'VS Code', url: 'https://code.visualstudio.com/' },
    { file: 'neovim.gif', alt: 'Neovim', url: 'https://neovim.io/' },
    { file: 'js.gif', alt: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { file: 'ts.png', alt: 'TypeScript', url: 'https://www.typescriptlang.org/' },
]

let el = (id) => document.getElementById(id)
let content = el('content')
let navBtns = document.querySelectorAll('.section-nav button')
let badgesEl = el('badges')

function showSection(name) {
    if (name === activeSection) return
    activeSection = name
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.section === name))
    if (name === 'about') renderAbout()
    else if (name === 'projects') renderProjects()
    else if (name === 'blog') renderBlog()
}

function renderAbout() {
    content.innerHTML = `
        <div class="section-title">about</div>
        <div class="about-bio">
            hey, i'm <strong>divpreet</strong> — a developer who makes things on the internet.
            i build stuff, break stuff, and occasionally fix stuff, i also take part of hackclub events!
        </div>
        <div class="social-list">
            <a href="https://github.com/divpreeet" target="_blank" rel="noopener noreferrer" class="social-item">
                <span class="label">github</span>
                <span class="value">divpreeet</span>
            </a>
            <a href="https://hackclub.slack.com/team/U0801PU0MTQ" target="_blank" rel="noopener noreferrer" class="social-item">
                <span class="label">slack</span>
                <span class="value">currently doing nothing</span>
            </a>
        </div>
    `
}

async function renderProjects() {
    content.innerHTML = '<div class="section-title">projects</div><p style="color:#71717a;font-size:0.85rem;">loading...</p>'
    try {
        let res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`)
        if (!res.ok) throw 'fetch failed'
        let repos = await res.json()
        if (repos.length === 0) {
            content.innerHTML = '<div class="section-title">projects</div><p style="color:#71717a;font-size:0.85rem;">no projects found</p>'
            return
        }
        let html = '<div class="section-title">projects</div><div class="projects-grid">'
        repos.forEach(r => {
            html += `<a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
                <div class="name">${r.name}</div>
                <div class="desc">${r.description || 'no description'}</div>
                ${r.language ? `<div class="lang">${r.language}</div>` : ''}
            </a>`
        })
        content.innerHTML = html + '</div>'
    } catch {
        content.innerHTML = '<div class="section-title">projects</div><p style="color:#71717a;font-size:0.85rem;">failed to load projects</p>'
    }
}

async function renderBlog() {
    content.innerHTML = '<div class="section-title">blog</div><p style="color:#71717a;font-size:0.85rem;">loading...</p>'
    try {
        let res = await fetch('content/blog/index.json')
        if (!res.ok) throw 'fetch failed'
        let posts = await res.json()
        if (posts.length === 0) {
            content.innerHTML = '<div class="section-title">blog</div><p style="color:#71717a;font-size:0.85rem;">no posts yet</p>'
            return
        }
        let html = '<div class="section-title">blog</div><div class="blog-list">'
        posts.forEach(p => {
            html += `<a href="#" class="blog-post-link" data-slug="${p.slug}">
                <span class="blog-date">${p.date}</span>
                <span class="blog-title">${p.title}</span>
                <span class="blog-desc">${p.desc || ''}</span>
            </a>`
        })
        content.innerHTML = html + '</div>'
        content.querySelectorAll('.blog-post-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault()
                await renderPost(link.dataset.slug)
            })
        })
    } catch {
        content.innerHTML = '<div class="section-title">blog</div><p style="color:#71717a;font-size:0.85rem;">failed to load blog</p>'
    }
}

async function renderPost(slug) {
    content.innerHTML = '<p style="color:#71717a;font-size:0.85rem;">loading...</p>'
    try {
        let md = await (await fetch(`content/blog/${slug}.md`)).text()
        let posts = await (await fetch('content/blog/index.json')).json()
        let meta = posts.find(p => p.slug === slug)
        let title = meta ? `<h2 style="color:#fff;font-size:1.2rem;font-weight:600;margin:0.5rem 0 0.25rem">${meta.title}</h2>` : ''
        let date = meta ? `<p style="color:#52525b;font-size:0.75rem;margin-bottom:1rem">${meta.date}</p>` : ''

        let html = md
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, function(m) { return '<ul>' + m + '</ul>' })
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')

        content.innerHTML = `<a href="#" id="blog-back" style="color:#9ca3af;text-decoration:none;font-size:0.85rem;">← back to blog</a>${title}${date}<div class="prose">${html}</div>`
        el('blog-back').onclick = (e) => { e.preventDefault(); renderBlog() }
    } catch {
        content.innerHTML = '<p style="color:#71717a;font-size:0.85rem;">failed to load post</p>'
    }
}

function makeBtn(text, bg, fg) {
    let c = document.createElement('canvas')
    c.width = 88; c.height = 31
    let ctx = c.getContext('2d')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 88, 31)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 88, 1)
    ctx.fillRect(0, 0, 1, 31)
    ctx.fillRect(0, 30, 88, 1)
    ctx.fillRect(87, 0, 1, 31)
    ctx.fillStyle = fg
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 44, 16)
    return c.toDataURL()
}

BUTTONS.forEach(btn => {
    let a = document.createElement('a')
    if (btn.url) { a.href = btn.url; a.target = '_blank'; a.rel = 'noopener noreferrer' }
    else a.style.cursor = 'default'
    let img = document.createElement('img')
    img.src = btn.custom ? makeBtn(btn.text, btn.bg, btn.fg) : `https://88x31.nl/gifs/${btn.file}`
    img.alt = btn.alt || btn.text
    img.loading = 'lazy'
    a.appendChild(img)
    badgesEl.appendChild(a)
})

navBtns.forEach(btn => {
    btn.onclick = () => showSection(btn.dataset.section)
})

showSection('about')

// walking shrek
let sCvs = el('shrek-canvas')
let sCtx = sCvs.getContext('2d')
let sImg = new Image()
let shrekFrames = []
let mx = window.innerWidth / 2
let my = window.innerHeight / 2
let sx = Math.random() * window.innerWidth
let sy = Math.random() * window.innerHeight
let sf = 0

function resizeSCvs() {
    sCvs.width = window.innerWidth
    sCvs.height = window.innerHeight
}
window.addEventListener('resize', resizeSCvs)
resizeSCvs()

document.addEventListener('mousemove', function(e) {
    mx = e.clientX
    my = e.clientY
})

function makeWalkFrames(img) {
    var sw = 16, sh = 28
    var base = document.createElement('canvas')
    base.width = sw; base.height = sh
    var bctx = base.getContext('2d')
    bctx.imageSmoothingEnabled = false
    var s = Math.min(img.width, img.height)
    bctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, sw, sh)
    var bd = bctx.getImageData(0, 0, sw, sh)
    var bp = bd.data
    for (var i = 0; i < bp.length; i += 4) {
        var g = bp[i] * 0.3 + bp[i + 1] * 0.59 + bp[i + 2] * 0.11
        var v = g > 100 ? 255 : 0
        bp[i] = v; bp[i + 1] = v; bp[i + 2] = v
    }

    var legY = Math.floor(sh * 0.55)
    var mid = Math.floor(sw / 2)

    for (var f = 0; f < 4; f++) {
        var c = document.createElement('canvas')
        c.width = sw; c.height = sh
        var ctx = c.getContext('2d')
        var id = ctx.createImageData(sw, sh)
        var d = id.data

        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
                var srcX = x
                if (y >= legY && (f === 1 || f === 3)) {
                    var dir = (f === 1) ? -1 : 1
                    if (x < mid) srcX = x + dir
                    else srcX = x - dir
                }
                srcX = Math.max(0, Math.min(sw - 1, srcX))
                var si = (y * sw + srcX) * 4
                var di = (y * sw + x) * 4
                d[di] = bp[si]; d[di + 1] = bp[si + 1]
                d[di + 2] = bp[si + 2]; d[di + 3] = 255
            }
        }

        ctx.putImageData(id, 0, 0)
        shrekFrames.push(c)
    }
}

sImg.onload = function() {
    makeWalkFrames(sImg)
    requestAnimationFrame(animateShrek)
}

function animateShrek() {
    sf++
    var dx = mx - sx
    var dy = my - sy
    var dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 10) {
        var speed = Math.min(3, dist * 0.025)
        sx += (dx / dist) * speed
        sy += (dy / dist) * speed
    }

    sCtx.clearRect(0, 0, sCvs.width, sCvs.height)

    if (shrekFrames.length > 0) {
        var fi = Math.floor(sf / 8) % 4
        var bob = Math.sin(sf * 0.1) * 6
        var wobble = Math.sin(sf * 0.07) * 0.06
        var f = shrekFrames[fi]

        sCtx.save()
        sCtx.translate(sx, sy + bob)
        sCtx.rotate(wobble)
        sCtx.translate(-8, -14)
        sCtx.drawImage(f, 0, 0)
        sCtx.restore()
    }

    requestAnimationFrame(animateShrek)
}

sImg.src = 'shrek-pose3.png'
