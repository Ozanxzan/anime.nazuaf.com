const API="https://graphql.anilist.co";
const grid=document.querySelector("#grid"), heading=document.querySelector("#heading"), status=document.querySelector("#status");

const query=`query($sort:[MediaSort],$search:String){Page(perPage:24){media(type:ANIME,sort:$sort,search:$search){id title{romaji english native} coverImage{large} episodes status seasonYear averageScore format}}}`;

async function gql(variables){
  const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,variables})});
  if(!r.ok) throw Error("AniList request failed");
  const j=await r.json(); if(j.errors) throw Error(j.errors[0]?.message||"GraphQL error");
  return j.data.Page.media;
}
function card(a){
  const title=a.title.english||a.title.romaji||a.title.native||"Untitled";
  const meta=[a.format,a.seasonYear,a.episodes?`${a.episodes} eps`:""].filter(Boolean).join(" · ");
  return `<a class="card" href="anime.html?id=${a.id}">
    <div class="poster"><img loading="lazy" src="${a.coverImage.large}" alt="${escapeHtml(title)}"></div>
    <div class="title">${escapeHtml(title)}</div><div class="meta">${escapeHtml(meta)}</div>
  </a>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
async function load(search=""){
  status.textContent="Memuat...";
  try{
    const data=await gql(search?{search,sort:["POPULARITY_DESC"]}:{sort:["TRENDING_DESC"]});
    grid.innerHTML=data.length?data.map(card).join(""):`<div class="empty">Anime tidak ditemukan.</div>`;
    status.textContent=`${data.length} hasil`;
  }catch(e){grid.innerHTML=`<div class="empty">Gagal mengambil data AniList.</div>`;status.textContent="Error";}
}
document.querySelector("#searchForm").addEventListener("submit",e=>{e.preventDefault();const q=document.querySelector("#search").value.trim();heading.textContent=q?`Hasil: ${q}`:"Trending Anime";load(q)});
load();