// Fighters list page logic
const grid = document.getElementById('fighters-grid');
const searchInput = document.getElementById('search');
let all = [];

function placeholder(name){
  return `https://placehold.co/600x400?text=${encodeURIComponent(name)}`;
}

function card(f){
  const a = document.createElement('article');
  a.className = 'card';
  const name = f.fighterName || f.name;
  a.innerHTML = `
    <header><h3>${name}</h3></header>
    <img src="${f.imageURL || placeholder(name)}" alt="${name}">
    <ul>
      ${f.Power ? `<li><strong>Power:</strong> ${f.Power}</li>` : ''}
      ${f.Speed ? `<li><strong>Speed:</strong> ${f.Speed}</li>` : ''}
      ${f.Durability ? `<li><strong>Durability:</strong> ${f.Durability}</li>` : ''}
    </ul>
    <footer><a href="/fighters/${encodeURIComponent(name)}" role="button">View</a></footer>
  `;
  return a;
}

function render(list){
  grid.innerHTML='';
  list.forEach(f=>grid.appendChild(card(f)));
}

async function load(){
  const res = await fetch('/api');
  if(!res.ok){
    grid.innerHTML = '<p>Failed to load fighters.</p>';
    return;
  }
  all = await res.json();
  render(all);
}

searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q) return render(all);
  render(all.filter(f => (f.fighterName || f.name || '').toLowerCase().includes(q)));
});

function applyQueryParam(){
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if(q){
    searchInput.value = q;
    const low = q.toLowerCase();
    render(all.filter(f => (f.fighterName || f.name || '').toLowerCase().includes(low)));
  }
}

load().then(applyQueryParam);
