/* =====================================================
   1. JSON MA'LUMOTLARNI YUKLASH
===================================================== */

async function loadJSON(p) {
    return (await fetch(p)).json();
}
/* =====================================================
   2. OBYEKT KARTASINI YARATISH
===================================================== */
function card(o) {
    return `
        <article class="lot">

            <div class="lot-img">
                ${o.image}
                <span class="tag">${o.status}</span>
            </div>

            <div class="lot-body">

                <h3>${o.title}</h3>

                <div class="meta">
                    ${o.region}, ${o.district} ·
                    <b>${o.area} m²</b>
                </div>

                <div class="lot-foot">

                    <div class="price">
                        ${o.price}
                    </div>

                    <span
                        class="details"
                        onclick="showObject(${o.id})"
                    >
                        Batafsil →
                    </span>

                </div>

            </div>

        </article>
    `;
}
/* =====================================================
   3. OBYEKT HAQIDA BATAFSIL MA'LUMOT
===================================================== */

function showObject(id) {

    let o = window.allObjects.find(
        x => x.id === id
    );

    alert(`
${o.title}

Hudud: ${o.region}, ${o.district}
Maydon: ${o.area} m²
Holati: ${o.status}
Shart: ${o.price}
    `);
}


/* =====================================================
   4. SAYTNI ISHGA TUSHIRISH
===================================================== */

async function init() {

    let [
        s,
        o,
        n,
        d
    ] = await Promise.all([

        loadJSON("../data/settings.json")
            .catch(() =>
                loadJSON("data/settings.json")
            ),

        loadJSON("../data/objects.json")
            .catch(() =>
                loadJSON("data/objects.json")
            ),

        loadJSON("../data/news.json")
            .catch(() =>
                loadJSON("data/news.json")
            ),

        loadJSON("../data/docs.json")
            .catch(() =>
                loadJSON("data/docs.json")
            )
    ]);

    window.allObjects = o;


    /* ================================
       SAYT NOMI
    ================================= */

    document
        .querySelectorAll("[data-site-name]")
        .forEach(x =>
            x.textContent = s.site_name
        );


    /* ================================
       TELEFON
    ================================= */

    document
        .querySelectorAll("[data-phone]")
        .forEach(x =>
            x.textContent = s.phone
        );


    /* ================================
       EMAIL
    ================================= */

    document
        .querySelectorAll("[data-email]")
        .forEach(x =>
            x.textContent = s.email
        );


    /* ================================
       ISHONCH TELEFONI
    ================================= */

    document
        .querySelectorAll("[data-hotline]")
        .forEach(x =>
            x.textContent = s.hotline
        );
}
/* =====================================================
   5. LOTLARNI CHIQARISH
===================================================== */

let lb = document.querySelector("#lots");

if (lb) {
    lb.innerHTML = o
        .slice(0, 3)
        .map(card)
        .join("");
}


/* =====================================================
   6. YANGILIKLARNI CHIQARISH
===================================================== */

let nb = document.querySelector("#news");

if (nb) {

    nb.innerHTML = n
        .map(x => `
            <article class="n-card">

                <div class="date">
                    ${x.date}
                </div>

                <h3>
                    ${x.title}
                </h3>

                <p>
                    ${x.text}
                </p>

            </article>
        `)
        .join("");
}


/* =====================================================
   7. HUJJATLARNI CHIQARISH
===================================================== */

let db = document.querySelector("#docs");

if (db) {

    db.innerHTML = d
        .map(x => `
            <div class="doc">

                <b>PDF</b>
                ${x.title}

                <small>
                    ${x.date} · ${x.size}
                </small>

            </div>
        `)
        .join("");
}
/* =====================================================
   8. HUDUDLARNI SELECTGA QO'SHISH
===================================================== */

let r = document.querySelector("#region");

if (r) {

    [
        ...new Set(
            o.map(x => x.region)
        )
    ].forEach(x => {

        r.insertAdjacentHTML(
            "beforeend",
            `<option>${x}</option>`
        );

    });
}
/* =====================================================
   9. BARCHA NATIJALARNI CHIQARISH
===================================================== */

let res = document.querySelector("#results");

if (res) {
    res.innerHTML = o
        .map(card)
        .join("");
}


/* =====================================================
   10. OBYEKTLARNI QIDIRISH
===================================================== */

function searchObjects() {

    let r =
        document.querySelector("#region").value;

    let t =
        document.querySelector("#type").value;

    let q =
        document
            .querySelector("#query")
            .value
            .toLowerCase();


    let a = window.allObjects.filter(o =>

        (!r || o.region === r) &&

        (!t || o.type === t) &&

        (
            !q ||
            JSON.stringify(o)
                .toLowerCase()
                .includes(q)
        )

    );


    document.querySelector("#results").innerHTML =
        a.length
            ? a.map(card).join("")
            : "Ma'lumot topilmadi.";
}
/* =====================================================
   11. YANGI OBYEKT QO'SHISH
===================================================== */

function addObject() {

    let t = document.querySelector("#a-title").value;

    let r = document.querySelector("#a-region").value;

    let a = document.querySelector("#a-area").value;

    let p = document.querySelector("#a-price").value;


    /* ================================================
       MAJBURIY MAYDONLARNI TEKSHIRISH
    ================================================= */

    if (!t || !r) {
        return alert(
            "Nom va hududni kiriting"
        );
    }

    /* ================================================
       LOCALSTORAGE'DAN MA'LUMOTLARNI OLISH
    ================================================= */

    let x = JSON.parse(
        localStorage.getItem(
            "davijara_objects"
        ) || "[]"
    );


    /* ================================================
       YANGI OBYEKTNI YARATISH
    ================================================= */

    x.push({

        id: Date.now(),

        title: t,

        region: r,

        district: "Yangi obyekt",

        type: "Davlat obyekti",

        area: a,

        price: p,

        status: "Yangi lot",

        image: "🏢"

    });


    /* ================================================
       LOCALSTORAGE'GA SAQLASH
    ================================================= */

    localStorage.setItem(
        "davijara_objects",
        JSON.stringify(x)
    );


    /* ================================================
       SAQLANGANLIGI HAQIDA XABAR
    ================================================= */

    alert(
        "Obyekt demo rejimida saqlandi."
    );
}


/* =====================================================
   12. SAHIFA TO'LIQ YUKLANGANDAN KEYIN ISHGA TUSHIRISH
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    init
);

