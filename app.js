const API="https://graphql.anilist.co";
const grid=document.querySelector("#grid"),heading=document.querySelector("#heading"),status=document.querySelector("#status");
const params=new URLSearchParams(location.search);
const genre=params.get("genre")||"";
const query=`query($sort:[MediaSort],$search:String,$genre:String){Page(perPage:24){media(type:ANIME,sort:$sort,search:$search,genre:$genre){id title{romaji english native} coverImage{large} episodes status seasonYear averageScore format}}}`;
async function gql(variables){const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,variables})});if(!r.ok)throw Error();const j=await r.json();if(j.errors)throw Error(j.errors[0]?.message||"GraphQL error");return j.data.Page.media}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function card(a){const t=a.title.english||a.title.romaji||a.title.native||"Untitled";const m=[a.format,a.seasonYear,a.episodes?`${a.episodes} eps`:""].filter(Boolean).join(" · ");return `<a class="card" href="anime.html?id=${a.id}"><div class="poster"><img loading="lazy" src="${esc(a.coverImage.large)}" alt="${esc(t)}"></div><div class="title">${esc(t)}</div><div class="meta">${esc(m)}</div></a>`}
async function load(search=""){status.textContent="Memuat…";try{const variables=search?{search,sort:["POPULARITY_DESC"]}:genre?{genre,sort:["POPULARITY_DESC"]}:{sort:["TRENDING_DESC"]};const d=await gql(variables);grid.innerHTML=d.length?d.map(card).join(""):`<div class="empty">Anime tidak ditemukan.</div>`;status.textContent=`${d.length} hasil`}catch(e){grid.innerHTML=`<div class="empty">Gagal mengambil data AniList.</div>`;status.textContent="Error"}}
const searchInput=document.querySelector("#search");
if(genre){heading.textContent=`Genre: ${genre}`;document.title=`Anime ${genre} — Nazuaf Anime`;searchInput.value=""}else{heading.textContent="Trending Anime"}
document.querySelector("#searchForm").addEventListener("submit",e=>{e.preventDefault();const q=searchInput.value.trim();if(q){history.replaceState(null,"",`/?search=${encodeURIComponent(q)}`);heading.textContent=`Hasil: ${q}`;load(q)}else{history.replaceState(null,"","/");heading.textContent="Trending Anime";load()}});
const initialSearch=params.get("search")||"";
if(initialSearch){searchInput.value=initialSearch;heading.textContent=`Hasil: ${initialSearch}`;load(initialSearch)}else load();
