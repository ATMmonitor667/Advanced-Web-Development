const content = document.getElementById('content');
const searchInput = document.getElementById('search');
let allFighters = [];

function placeholderImg(name) {
  const safe = encodeURIComponent(name);
  return `https://placehold.co/600x400?text=${safe}`;
}

function fighterCard(f) {
  const name = f.fighterName || f.name;
  const imgSrc = f.image || placeholderImg(name);
  const desc = f.description || f.bio || '—';

  const article = document.createElement('article');
  article.className = 'card';

  const header = document.createElement('header');
  const h3 = document.createElement('h3');
  h3.textContent = name;
  header.appendChild(h3);


  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = name;

  const p = document.createElement('p');
  p.textContent = desc;


  const ul = document.createElement('ul');
  const stats = ['power', 'speed', 'durability', 'iq'];
  stats.forEach(stat => {
    if (f[stat]) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${stat[0].toUpperCase() + stat.slice(1)}:</strong> ${f[stat]}`;
      ul.appendChild(li);
    }
  });


  const footer = document.createElement('footer');
  const link = document.createElement('a');
  link.href = `/fighters/${encodeURIComponent(name)}`;
  link.role = 'button';
  link.textContent = 'Details';
  footer.appendChild(link);


  article.append(header, img, p, ul, footer);

  return article;
}
function fighterDetail(f) {
  const name = f.fighterName || f.name;
  const imgSrc = f.image || placeholderImg(name);
  const desc = f.description || f.bio || 'No description available.';

  const article = document.createElement('article');


  const header = document.createElement('header');
  const h2 = document.createElement('h2');
  h2.textContent = name;
  header.appendChild(h2);


  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = name;


  const pDesc = document.createElement('p');
  pDesc.textContent = desc;


  const h4 = document.createElement('h4');
  h4.textContent = 'Attributes';

  const ul = document.createElement('ul');
  const stats = ['power', 'speed', 'durability', 'iq'];
  stats.forEach(stat => {
    if (f[stat]) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${stat[0].toUpperCase() + stat.slice(1)}:</strong> ${f[stat]}`;
      ul.appendChild(li);
    }
  });


  const pBack = document.createElement('p');
  const backLink = document.createElement('a');
  backLink.href = '/';
  backLink.role = 'button';
  backLink.className = 'secondary';
  backLink.textContent = 'Back to list';
  pBack.appendChild(backLink);

  article.append(header, img, pDesc, h4, ul, pBack);

  return article;
}

function renderList(list) {
  content.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'grid';
  list.forEach(f => grid.appendChild(fighterCard(f)));
  content.appendChild(grid);
}

function renderDetail(f) {
  content.innerHTML = '';
  content.appendChild(fighterDetail(f));
}

async function loadAll() {
  const res = await fetch('/api');
  if (!res.ok) throw new Error('Failed to fetch fighters');
  allFighters = await res.json();
  renderList(allFighters);
}

async function loadDetail(name) {
  const res = await fetch(`/api/name/${encodeURIComponent(name)}`);
  if (res.status === 404) {
    window.location.href = '/404.html';
    return;
  }
  const arr = await res.json();
  if (!arr || !arr.length) {
    window.location.href = '/404.html';
    return;
  }
  renderDetail(arr[0]);
}

function attachSearch() {
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return renderList(allFighters);
    const filtered = allFighters.filter(f => (f.fighterName || f.name || '').toLowerCase().includes(q));
    renderList(filtered);
  });
}

function init() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') {
    loadAll().then(attachSearch).catch(e => console.error(e));
  } else if (path.startsWith('/fighters/')) {
    const name = decodeURIComponent(path.split('/').pop());
    loadDetail(name).catch(e => console.error(e));
  } else {
    window.location.href = '/404.html';
  }
}

init();
