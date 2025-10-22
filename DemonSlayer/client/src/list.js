// Character list page logic
const grid = document.getElementById('characters-grid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('search');

function placeholder(name) {
  return `https://placehold.co/300x200?text=${encodeURIComponent(name)}`;
}

function card(character) {
  const name = character.name;
  const imageUrl = character.image_url || placeholder(name);

  return `
    <article class="character-card" onclick="goToCharacter('${name}')">
      <img src="${imageUrl}" alt="${name}" />
      <header>
        <h3>${name}</h3>
      </header>
      <footer>
        <div class="stats">
          <div class="stat"><strong>Power:</strong> ${character.power}</div>
          <div class="stat"><strong>Speed:</strong> ${character.speed}</div>
          <div class="stat"><strong>Durability:</strong> ${character.durability}</div>
          <div class="stat"><strong>Intelligence:</strong> ${character.intelligence}</div>
        </div>
        <div class="breathing">${character.breathing}</div>
      </footer>
    </article>
  `;
}

function goToCharacter(name) {
  window.location.href = `/characters/${encodeURIComponent(name)}`;
}

function filterCharacters(characters, query) {
  if (!query) return characters;

  const q = query.toLowerCase();
  return characters.filter(character =>
    character.name.toLowerCase().includes(q) ||
    character.breathing.toLowerCase().includes(q)
  );
}

function render(characters) {
  if (characters.length === 0) {
    grid.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>No characters found matching your search.</p></div>';
    return;
  }

  grid.innerHTML = characters.map(card).join('');
}

async function load() {
  try {
    loading.style.display = 'block';

    const res = await fetch('/api');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const characters = await res.json();
    console.log('Loaded characters:', characters);

    loading.style.display = 'none';

    // Handle URL search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';

    if (searchQuery) {
      searchInput.value = searchQuery;
    }

    const filtered = filterCharacters(characters, searchQuery);
    render(filtered);

    // Store characters for search functionality
    window.allCharacters = characters;

  } catch (error) {
    console.error('Error loading characters:', error);
    loading.style.display = 'none';
    grid.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>Error loading characters. Please try again later.</p>
        <button onclick="load()">Retry</button>
      </div>
    `;
  }
}

// Search functionality
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  if (window.allCharacters) {
    const filtered = filterCharacters(window.allCharacters, query);
    render(filtered);
  }

  // Update URL without page reload
  const url = new URL(window.location);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  window.history.replaceState({}, '', url);
});

// Handle form submission
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  // Search is handled by input event, so just prevent form submission
});

// Load characters on page load
load();