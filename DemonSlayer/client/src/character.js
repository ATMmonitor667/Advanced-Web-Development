// Character detail page logic
const container = document.getElementById('detail-container');
const titleEl = document.getElementById('character-name');
const searchInput = document.getElementById('search');

function placeholder(name){
  return `https://placehold.co/800x450?text=${encodeURIComponent(name)}`;
}

function getNameFromPath(){
  // Expect URL like /characters/<name>
  const parts = window.location.pathname.split('/').filter(Boolean);
  console.log('URL parts:', parts); // Debug log
  return decodeURIComponent(parts[1] || '');
}

async function load(name){
  console.log('Loading character:', name); // Debug log
  if(!name) {
    container.innerHTML = '<p>No character name provided.</p><p><a href="/" role="button">Back</a></p>';
    return;
  }

  container.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(`/api/name/${encodeURIComponent(name)}`);
    console.log('API response status:', res.status); // Debug log

    if(!res.ok){
      container.innerHTML = '<p>Character not found.</p><p><a href="/" role="button">Back</a></p>';
      return;
    }

    const data = await res.json();
    console.log('API response data:', data); // Debug log

    if(!data.length){
      container.innerHTML = '<p>Character not found.</p><p><a href="/" role="button">Back</a></p>';
      return;
    }

    const character = data[0];
    titleEl.textContent = character.name;
    const characterName = character.name;

    container.innerHTML = `
      <article class="character-detail">
        <header><h2>${characterName}</h2></header>
        <img src="${character.image_url || placeholder(characterName)}" alt="${characterName}" />

        <section>
          <h4>Character Attributes</h4>
          <div class="attributes">
            <div class="attribute">
              <div class="attribute-value">${character.power}</div>
              <div class="attribute-label">Power</div>
            </div>
            <div class="attribute">
              <div class="attribute-value">${character.speed}</div>
              <div class="attribute-label">Speed</div>
            </div>
            <div class="attribute">
              <div class="attribute-value">${character.durability}</div>
              <div class="attribute-label">Durability</div>
            </div>
            <div class="attribute">
              <div class="attribute-value">${character.intelligence}</div>
              <div class="attribute-label">Intelligence</div>
            </div>
          </div>
        </section>

        <section>
          <h4>Breathing Technique</h4>
          <p><strong>${character.breathing}</strong></p>
          <p>This character specializes in the art of ${character.breathing}, demonstrating exceptional mastery in the Demon Slayer universe.</p>
        </section>

        <p><a href="/" role="button" class="secondary">Back to Character List</a></p>
      </article>
    `;
  } catch (error) {
    console.error('Error loading character:', error);
    container.innerHTML = '<p>Error loading character data.</p><p><a href="/" role="button">Back</a></p>';
  }
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim();
  if(q.length === 0) return; // stay on detail page unless a query exists
  window.location.href = `/?q=${encodeURIComponent(q)}`;
});

// On load, get character name from URL and load data
load(getNameFromPath());