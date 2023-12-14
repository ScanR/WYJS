const fs = require('fs');
const { parse }= require('node-html-parser');
const Canvas = require("@napi-rs/canvas");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const scrappingSeries = {
    onk : "『【推しの子】』／赤坂アカ╳横槍メンゴ",
    uma : "『ウマ娘 シンデレラグレイ』／漫画：久住太陽　脚本：杉浦理史＆Pita　漫画企画構成：伊藤隼之介（原作：Cygames）",
    renai : "『恋愛代行』／赤坂アカ╳西沢5㍉"
}

const path = "./series"

let cid;
let Cookie;

readline.question("Entrez les cookies :",(cookie => {
    Cookie = cookie;
    console.log(cookie);
    readline.question("Entrez le cid (dernier jump par défaut) :",id =>{
        cid = id;
        main();
        readline.close()
    })
}));


const main = async () => {


    if(!fs.existsSync(path)) fs.mkdirSync(path);
    const masterObject = {}

    masterObject.cid = cid != "" ? cid : await getCid();
    masterObject.u1 = "10001";
    masterObject.baseImage = `https://www.youngjump.world/books/${masterObject.cid}/1/img/`
    masterObject.dmytime = "20231213160007";
    masterObject.k = getRandomKey(masterObject.cid)
    masterObject.bib = await getBibInfo(masterObject);

    const jsonContent = await getJsonContent(masterObject);
    const t = jsonContent.ttx.replace(/<t-case\s+[^>]*screen\.portrait[^>]*>(.*?)<\/t-case>/gim, "")
    const allPage = rt(t,jsonContent.searchXml,masterObject.bib.stbl,masterObject.bib.ttbl)

    const document = parse(jsonContent.ttx);
    const series = Array.from(document.querySelectorAll("t-contents a"));

    Object.entries(scrappingSeries).forEach(async ([index,value])=> {
        const serie = series.filter(a => a.textContent == value)[0]
        if(!serie) return console.log(`Pas de ${index} cette semaine`);

        const pageDebut = serie.attributes.href.slice(-3)
        const pageFin = series.at(series.indexOf(serie)+1).attributes.href.slice(-3)
        const pagesSerie = allPage.slice(pageDebut-1,pageFin-1);

        const folderSeries = `./${path}/${index}`
        if(!fs.existsSync(folderSeries)) fs.mkdirSync(folderSeries);

        const folder = `${folderSeries}/${jsonContent.ContentDate.slice(0,8)}`;
        if(fs.existsSync(folder)) return console.log(`${index} déjà dl`);
        fs.mkdirSync(folder)
        const download = downloader(folder,masterObject);
        await Promise.all(pagesSerie.map(download));
        console.log(`${index} end`)

    });

}

const downloader = (folder,masterObject) =>{
    return async (value,index) => {
        const image = await unscrap(value,masterObject);
        fs.writeFileSync(`${folder}/${format(index+1)}.jpg`,image);
    }
}

const unscrap = async (pageUse,masterObject) => {
        const bufferImage = await fetch(`${masterObject.baseImage}${pageUse.src}?dmytime=${masterObject.dmytime}&u1=${masterObject.u1}`,{headers:{"Cookie":Cookie}}).then(res => res.arrayBuffer());

        const image = await Canvas.loadImage(Buffer.from(bufferImage));
        const width = image.width;
        const height = image.height;

        const coordonnees = getImageDescrambleCoords(pageUse,width,height,masterObject.bib)
        const final = new Canvas.Canvas(coordonnees.width,coordonnees.height);
        const context = final.getContext("2d");

        coordonnees.transfers[0].coords.forEach(coord => {
            context.drawImage(image,coord.xsrc,coord.ysrc,coord.width,coord.height,coord.xdest,coord.ydest,coord.width,coord.height);
        })
        return await final.encode("jpeg");
}

const getBibInfo = async (masterObject) => {
    const bibGetCntntInfoURL = `https://www.youngjump.world/sws/apis/bibGetCntntInfo.php?cid=${masterObject.cid}&dmytime=${masterObject.dmytime}&k=${masterObject.k}&u1=${masterObject.u1}`
    
    const jsonBib = await fetch(bibGetCntntInfoURL,{headers:{"Cookie":Cookie}}).then(res => res.json());
    
    return z(jsonBib,masterObject.cid,masterObject.k)
}

const getJsonContent = async (masterObject) => {
    const contentUrl = `https://www.youngjump.world/books/${masterObject.cid}/1/content?dmytime=${masterObject.dmytime}&u1=${masterObject.u1}`
    return await fetch(contentUrl,{headers:{"Cookie":Cookie}}).then(res => res.json());
}

const kt = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

const lt = (t,bib) => {
    var i = [0, 0];
    if (t) {
        for (var n = t.lastIndexOf("/") + 1, r = t.length - n, e = 0; e < r; e++)
            i[e % 2] += t.charCodeAt(e + n);
        i[0] %= 8,
        i[1] %= 8
    }
    var s = bib.ptbl[i[0]]
        , h = bib.ctbl[i[1]];
    return "=" === h.charAt(0) && "=" === s.charAt(0) ? new f(h,s) : h.match(/^[0-9]/) && s.match(/^[0-9]/) ? new a(h,s) : "" === h && "" === s ? new u : null
}

function f(t, i) {
    this.St = function(t) {
        var i, n = [], r = [], e = [];
        for (i = 0; i < this.T; i++)
            n.push(kt[t.charCodeAt(i)]);
        for (i = 0; i < this.j; i++)
            r.push(kt[t.charCodeAt(this.T + i)]);
        for (i = 0; i < this.T * this.j; i++)
            e.push(kt[t.charCodeAt(this.T + this.j + i)]);
        return {
            t: n,
            n: r,
            p: e
        }
    }
    this.bt = function(t) {
        if (!this.vt())
            return null;
        if (!this.Ot(t))
            return [{
                xsrc: 0,
                ysrc: 0,
                width: t.width,
                height: t.height,
                xdest: 0,
                ydest: 0
            }];
        for (var i = t.width - 2 * this.T * this.xt, n = t.height - 2 * this.j * this.xt, r = Math.floor((i + this.T - 1) / this.T), e = i - (this.T - 1) * r, s = Math.floor((n + this.j - 1) / this.j), h = n - (this.j - 1) * s, u = [], o = 0; o < this.T * this.j; ++o) {
            var a = o % this.T
                , f = Math.floor(o / this.T)
                , c = this.xt + a * (r + 2 * this.xt) + (this.Tt[f] < a ? e - r : 0)
                , l = this.xt + f * (s + 2 * this.xt) + (this.Pt[a] < f ? h - s : 0)
                , v = this.It[o] % this.T
                , d = Math.floor(this.It[o] / this.T)
                , b = v * r + (this.Ct[d] < v ? e - r : 0)
                , g = d * s + (this.At[v] < d ? h - s : 0)
                , p = this.Tt[f] === a ? e : r
                , m = this.Pt[a] === f ? h : s;
            0 < i && 0 < n && u.push({
                xsrc: c,
                ysrc: l,
                width: p,
                height: m,
                xdest: b,
                ydest: g
            })
        }
        return u
    }
    this.vt = function() {
        return null !== this.It
    }
    this.Ot = function(t) {
        var i = 2 * this.T * this.xt
          , n = 2 * this.j * this.xt;
        return t.width >= 64 + i && t.height >= 64 + n && t.width * t.height >= (320 + i) * (320 + n)
    }
    this.dt = function(t) {
        return this.Ot(t) ? {
            width: t.width - 2 * this.T * this.xt,
            height: t.height - 2 * this.j * this.xt
        } : t
    }
    this.It = null;
    var n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/)
        , r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
    if (null !== n && null !== r && n[1] === r[1] && n[2] === r[2] && n[4] === r[4] && "+" === n[3] && "-" === r[3] && (this.T = parseInt(n[1], 10),
    this.j = parseInt(n[2], 10),
    this.xt = parseInt(n[4], 10),
    !(8 < this.T || 8 < this.j || 64 < this.T * this.j))) {
        var e = this.T + this.j + this.T * this.j;
        if (n[5].length === e && r[5].length === e) {
            var s = this.St(n[5])
                , h = this.St(r[5]);
            this.Ct = s.n,
            this.At = s.t,
            this.Tt = h.n,
            this.Pt = h.t,
            this.It = [];
            for (var u = 0; u < this.T * this.j; u++)
                this.It.push(s.p[h.p[u]])
        }
    }
}

const getImageDescrambleCoords = (t, i, n, bib) => {
    var r = lt(t.src,bib);
    if (!r || !r.vt())
        return null;
    var e = r.dt({
        width: i,
        height: n
    });
    return {
        width: e.width,
        height: e.height,
        transfers: [{
            index: 0,
            coords: r.bt({
                width: i,
                height: n
            })
        }]
    }
}



const rt = (t, i, n, r) => {
    var e, s = /<(t-pb|t-img|img|a)(\s+([^>]*)|)>/gi, h = [], u = [], o = 0;
    if (i) {
        var a = i.firstElementChild || i.firstChild || null
            , f = a ? parseInt(a.getAttribute("version"), 10) : 1;
        o = f || 1
    }
    for (; e = s.exec(t); ) {
        var c = e[1].toLowerCase()
            , l = getTagAttributes(e[2]);
        if ("t-pb" === c)
            h = [];
        else if ("t-img" === c || "img" === c) {
            var v = {
                id: "",
                src: "",
                orgwidth: 0,
                orgheight: 0,
                pagespread: -1,
                anchors: h.concat(),
                texts: [],
                usemap: ""
            };
            for (var d in l)
                if ("id" === d)
                    v.id = l[d];
                else if ("src" === d)
                    v.src = l[d];
                else if ("orgwidth" === d)
                    v.orgwidth = parseInt(l[d], 10);
                else if ("orgheight" === d)
                    v.orgheight = parseInt(l[d], 10);
                else if ("a" === d) {
                    var b = parseInt(l[d], 10);
                    0 <= b && b < 30 && (v.pagespread = [2, 0, 1][Math.floor(b / 10)])
                } else
                    "usemap" === d && (v.usemap = l[d]);
            if (v.src && v.orgwidth && v.orgheight) {
                if (0 < o) {
                    var g = i.querySelector('item[href="' + v.src + '"]');
                    g && (v.texts = 2 === o ? w.mt(g, v.orgwidth, v.orgheight, n, r) : w.wt(g, v.orgwidth, v.orgheight, n, r))
                }
                u.push(v)
            }
            h = []
        } else if ("a" === c)
            for (var d in l)
                "name" === d && h.push(l[d])
    }
    return u
}





const getTagAttributes = (t) => {
    for (var i, n = {}, r = /([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/gi; null !== (i = r.exec(t)); ) {
        var e = i[1].toLowerCase()
            , s = i[2].toString();
        n[e] = s
    }
    return n
}

const getRandomKey = (t) => {
    var n = getRandomString(16)
                , i = Array(Math.ceil(16 / t.length) + 1).join(t)
                , r = i.substr(0, 16)
                , e = i.substr(-16, 16)
                , s = 0
                , h = 0
                , u = 0;
    return n.split("").map(function(t, i) {
        return s ^= n.charCodeAt(i),
        h ^= r.charCodeAt(i),
        u ^= e.charCodeAt(i),
        t + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[s + h + u & 63]
    }).join("")
}

const getRandomString = function(t, i) {
    for (var n = i || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", r = n.length, e = "", s = 0; s < t; s++)
        e += n.charAt(Math.floor(Math.random() * r));
    return e
}


const toNumberArray = (t) => {
    if (!Array.isArray(t))
        throw TypeError();
    if (t.some(function(t) {
        return "number" != typeof t
    }))
        throw TypeError();
    return t
}

const toStringArray = (t) => {
    if (!Array.isArray(t))
        throw TypeError();
    if (t.some(function(t) {
        return "string" != typeof t
    }))
        throw TypeError();
    return t
}

const z = (t, i, n) => {
    if (!("result"in t))
                return new Error("Is not a return value of bibGetCntntInfo API.");
            if (1 !== t.result)
                return new Error("Failed to execute bibGetCntntInfo API.");
            if (!("items"in t && Array.isArray(t.items)))
                return new Error("There is no item.");
            var e = t.items[0];
            if (!("ContentsServer"in e && e.ContentsServer))
                return new Error("Undefined ContentsServer.");
            if ("string" != typeof e.ContentsServer)
                return new Error("Invalid type of ContentsServer.");
            var s = e.ContentsServer.replace(/\/?$/, "/")
                , h = `https://www.youngjump.world/books/${i}/1/`
            if (!("ViewMode"in e))
                return new Error("Missing ViewMode.");
            var u = -1
                , o = "ServerType"in e ? parseInt(e.ServerType, 10) : 0;
            if (0 === o)
                u = 0;
            else if (1 === o)
                u = 1;
            else {
                if (2 !== o)
                    return new Error("Invalid value of ServerType.");
                u = 2
            }
            var a = "p"in e ? e.p : null;
            if (a) {
                if (null !== a && "string" != typeof a)
                    return new Error("Invalid type of request token.")
            } else
                a = "null";
            var f = -1
                , c = parseInt(e.ViewMode, 10);
            if (-1 === c)
                return new Error("Can't read via ViewMode.");
            if (1 === c)
                f = 1;
            else if (2 === c)
                f = 2;
            else {
                if (3 !== c)
                    return new Error("Invalid value of ViewMode.");
                f = 3
            }
            if (!("stbl"in e && "ttbl"in e && "ctbl"in e && "ptbl"in e))
                return new Error("Missing scramble table.");
            try {
                var l = toNumberArray(pt(i, n, e.stbl))
                    , v = toNumberArray(pt(i, n, e.ttbl))
                    , d = toStringArray(pt(i, n, e.ctbl))
                    , b = toStringArray(pt(i, n, e.ptbl))
            } catch (t) {
                return new Error("Invalid format of scramble table.")
            }
            return {
                sbcurl: h,
                servertype: u,
                viewmode: f,
                token: a,
                stbl: l,
                ttbl: v,
                ctbl: d,
                ptbl: b
            }
}

pt = function(t, i, n) {
    for (var r = t + ":" + i, e = 0, s = 0; s < r.length; s++)
        e += r.charCodeAt(s) << s % 16;
    0 == (e &= 2147483647) && (e = 305419896);
    var h = ""
        , u = e;
    for (s = 0; s < n.length; s++) {
        u = u >>> 1 ^ 1210056708 & -(1 & u);
        var o = (n.charCodeAt(s) - 32 + u) % 94 + 32;
        h += String.fromCharCode(o)
    }
    try {
        return JSON.parse(h)
    } catch (t) {}
    return null
}

const numberFormat = new Intl.NumberFormat('fr-FR',{minimumIntegerDigits:2});
const format = numberFormat.format;

const getCid = async () => {
    const contentUrl = `https://www.youngjump.world/yj-rest-apis/getBookInfo.php`
    const json = await fetch(contentUrl,{headers:{"Cookie":Cookie}}).then(res => res.json());
    const urlParam = new URLSearchParams(json[0].url);
    return urlParam.get("/reader/reader.html?cid");
}

