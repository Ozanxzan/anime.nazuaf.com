const API = "https://graphql.anilist.co";
const params = new URLSearchParams(location.search);
const genre = (params.get("name") || "").trim();
const grid = document.querySelector("#grid");
const heading = document.querySelector("#heading");
const sectionTitle = document.querySelector("#sectionTitle");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#search");

const query = `query($genre:String!){
  Page(perPage:24){
    media(type:ANIME,sort:POPULARITY_DESC,genre:$genre){
      id
      title{romaji english native}
      coverImage{large}
      episodes status seasonYear averageScore format
      genres
    }
  }
}`;

const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

function card(a){
  const t = a.title.english || a.title.romaji || a.title.native || "Untitled";
  const m = [a.format,a.seasonYear,a.episodes ? `${a.episodes} eps` : ""].filter(Boolean).join(" · ");
  return `<a class="card" href="/anime.html?id=${a.id}">
    <div class="poster"><img loading="lazy" src="${esc(a.coverImage?.large || "")}" alt="${esc(t)}"></div>
    <div class="title">${esc(t)}</div>
    <div class="meta">${esc(m)}</div>
  </a>`;
}

async function loadGenre(){
  if(!genre){
    heading.textContent = "Genre tidak ditemukan";
    sectionTitle.textContent = "Pilih genre dari halaman anime";
    status.textContent = "";
    grid.innerHTML = `<div class="empty">Belum ada genre yang dipilih.</div>`;
    return;
  }

  heading.textContent = genre;
  sectionTitle.textContent = `Anime genre ${genre}`;
  document.title = `${genre} — Nazuaf Anime`;
  status.textContent = "Memuat…";

  try{
    const r = await fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({query,variables:{genre}})
    });
    if(!r.ok) throw Error("AniList request failed");
    const j = await r.json();
    if(j.errors) throw Error(j.errors[0]?.message || "GraphQL error");

    const media = j.data?.Page?.media || [];
    // Safety check: only render titles that actually contain the requested genre.
    const wanted = genre.toLowerCase();
    const filtered = media.filter(a => (a.genres || []).some(g => g.toLowerCase() === wanted));

    grid.innerHTML = filtered.length
      ? filtered.map(card).join("")
      : `<div class="empty">Anime genre ${esc(genre)} tidak ditemukan.</div>`;
    status.textContent = `${filtered.length} hasil`;
  }catch(e){
    grid.innerHTML = `<div class="empty">Gagal mengambil anime genre ${esc(genre)} dari AniList.</div>`;
    status.textContent = "Error";
  }
}

document.querySelector("#searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  const q = searchInput.value.trim();
  if(q) location.href = `/?search=${encodeURIComponent(q)}`;
});

loadGenre();
