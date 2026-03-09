const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Character data
const characters = [
  {
    slug: 'tanjiro',
    name: 'Tanjiro Kamado',
    rank: 'Demon Slayer',
    breathing: 'Water / Hinokami Kagura',
    description:
      'The main protagonist who lost his family to demons. Kind-hearted and determined, he fights to cure his demon sister Nezuko. Tanjiro is known for his exceptional sense of smell and his ability to master multiple breathing styles, making him one of the most versatile Demon Slayers.',
    image: '/images/tanjiro.png',
    badge: 'Slayer',
    badgeColor: '#27ae60',
  },
  {
    slug: 'nezuko',
    name: 'Nezuko Kamado',
    rank: 'Demon',
    breathing: 'N/A',
    description:
      "Tanjiro's younger sister who was turned into a demon but retained her humanity. Possesses blood demon art abilities that allow her to generate and manipulate pink demonic flames. She fights alongside her brother to defeat Muzan Kibutsuji and reclaim her human life.",
    image: '/images/nezuko.png',
    badge: 'Demon',
    badgeColor: '#c0392b',
  },
  {
    slug: 'zenitsu',
    name: 'Zenitsu Agatsuma',
    rank: 'Demon Slayer',
    breathing: 'Thunder',
    description:
      'A cowardly but powerful Demon Slayer who can only use his full power while asleep. Master of Thunder Breathing First Form — Thunderclap and Flash — which he has refined to godlike speed. Despite his fearful personality, he possesses an extraordinary sense of hearing.',
    image: '/images/zenitsu.png',
    badge: 'Slayer',
    badgeColor: '#f39c12',
  },
  {
    slug: 'inosuke',
    name: 'Inosuke Hashibira',
    rank: 'Demon Slayer',
    breathing: 'Beast',
    description:
      'An aggressive fighter who grew up in the mountains with boars. Wears a boar mask and uses two serrated blades. He created his own unique Beast Breathing style based on his wild animal instincts. Despite his brash attitude, he grows to deeply care for his companions.',
    image: '/images/inosuke.png',
    badge: 'Slayer',
    badgeColor: '#16a085',
  },
  {
    slug: 'giyu',
    name: 'Giyu Tomioka',
    rank: 'Hashira (Water)',
    breathing: 'Water',
    description:
      'The Water Hashira, one of the most powerful Demon Slayers. Stoic and reserved, he was the first Hashira Tanjiro encountered. He is one of the few people who recognized Nezuko\'s unusual nature and chose to spare her. He invented his own exclusive Eleventh Form of Water Breathing.',
    image: '/images/giyu.png',
    badge: 'Hashira',
    badgeColor: '#2471a3',
  },
  {
    slug: 'rengoku',
    name: 'Rengoku Kyojuro',
    rank: 'Hashira (Flame)',
    breathing: 'Flame',
    description:
      'The Flame Hashira known for his passionate and enthusiastic personality. Incredibly powerful and honorable warrior who served as a mentor figure during the Mugen Train arc. His unwavering spirit and final words — "Set your heart ablaze!" — left a lasting impression on all who knew him.',
    image: '/images/rengoku.png',
    badge: 'Hashira',
    badgeColor: '#c0392b',
  },
];

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// API: get all characters
app.get('/api/characters', (req, res) => {
  res.json(characters);
});

// API: get single character by slug
app.get('/api/characters/:slug', (req, res) => {
  const character = characters.find((c) => c.slug === req.params.slug);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json(character);
});

// Detail page route
app.get('/characters/:slug', (req, res) => {
  const character = characters.find((c) => c.slug === req.params.slug);
  if (!character) {
    return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

// Home route (explicit, though static middleware also handles it)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Demon Slayer Compendium running at http://localhost:${PORT}`);
});
