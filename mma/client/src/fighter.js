// Fighter detail page logic
const container = document.getElementById('detail-container');
const titleEl = document.getElementById('fighter-name');
const searchInput = document.getElementById('search');

function placeholder(name){
  return `https://placehold.co/800x450?text=${encodeURIComponent(name)}`;
}

function getNameFromPath(){
  // Expect URL like /fighters/<name>
  const parts = window.location.pathname.split('/').filter(Boolean);
  console.log('URL parts:', parts); // Debug log
  return decodeURIComponent(parts[1] || '');
}

async function load(name){
  console.log('Loading fighter:', name); // Debug log
  if(!name) {
    container.innerHTML = '<p>No fighter name provided.</p><p><a href="/" role="button">Back</a></p>';
    return;
  }

  container.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(`/api/name/${encodeURIComponent(name)}`);
    console.log('API response status:', res.status); // Debug log

    if(!res.ok){
      container.innerHTML = '<p>Fighter not found.</p><p><a href="/" role="button">Back</a></p>';
      return;
    }

    const data = await res.json();
    console.log('API response data:', data); // Debug log

    if(!data.length){
      container.innerHTML = '<p>Fighter not found.</p><p><a href="/" role="button">Back</a></p>';
      return;
    }

    const f = data[0];
    titleEl.textContent = f.fighterName || f.name;
    const fighterName = f.fighterName || f.name;
    container.innerHTML = `
      <article>
        <header><h2>${fighterName}</h2></header>
        <img src="${f.imageURL || placeholder(fighterName)}" alt="${fighterName}" />
        <p>${f.Descrioption || f.description || f.bio || 'No description available.'}</p>
        <section>
          <h4>Attributes</h4>
          <ul>
            <li><strong>Weight Class:</strong> ${f.weightClass} lbs</li>
            ${f.Power ? `<li><strong>Power:</strong> ${f.Power}</li>` : ''}
            ${f.Speed ? `<li><strong>Speed:</strong> ${f.Speed}</li>` : ''}
            ${f.Durability ? `<li><strong>Durability:</strong> ${f.Durability}</li>` : ''}
            ${f.IQ ? `<li><strong>Fight IQ:</strong> ${f.IQ}</li>` : ''}
          </ul>
        </section>
        ${f.wikiPage ? `<p><a href="${f.wikiPage}" target="_blank" role="button">Wiki Page</a></p>` : ''}
        <p><a href="/" role="button" class="secondary">Back to list</a></p>
      </article>
    `;
  } catch (error) {
    console.error('Error loading fighter:', error);
    container.innerHTML = '<p>Error loading fighter data.</p><p><a href="/" role="button">Back</a></p>';
  }
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim();
  if(q.length === 0) return; // stay on detail page unless a query exists
  window.location.href = `/?q=${encodeURIComponent(q)}`;
});

// On load, optionally pick up query from /?q= when redirected (handled on list page)
load(getNameFromPath());
