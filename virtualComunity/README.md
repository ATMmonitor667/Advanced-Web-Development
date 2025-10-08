# WEB103 Project 3 - *Virtual Community Space*

Submitted by: **Your Name**

About this web app: **A virtual community space showcasing iconic anime battle locations and their upcoming/past events. Users can explore legendary battlefields from Dragon Ball, Naruto, and One Piece, view event details with live countdown timers, and filter events by location and time.**

Time spent: **X** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
- [x] **The PostgreSQL database includes a table that matches the data displayed in the web app**
  - [x] **NOTE: Your GIF or a screenshot added to the README must include a view of your Railway database that shows the contents of the table used by your app**

The following **optional** features are implemented:

- [x] The user can search for items with a specific attribute

The following **additional** features are implemented:

- [x] Real-time countdown timer for upcoming events
- [x] Past event detection and special styling
- [x] Dual filtering system (by location and time)
- [x] Responsive design with gradient backgrounds
- [x] Smooth animations and hover effects
- [x] Universe badges for different anime series

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with **ScreenToGif** for Windows or **LICEcap** for macOS.

## Notes

### Database Schema

The application uses two main tables:

**Locations Table:**
- `id` (Primary Key)
- `name` - Location name (e.g., "Cell Games Arena")
- `description` - Detailed location description
- `universe` - Anime universe (Dragon Ball, Naruto, One Piece)
- `image_url` - Location image URL

**Events Table:**
- `id` (Primary Key)
- `title` - Event title
- `description` - Event description
- `start_time` - Event start timestamp
- `end_time` - Event end timestamp
- `location_id` (Foreign Key) - References locations table
- `universe` - Anime universe
- `image_url` - Event image URL

### Features Implemented

1. **Homepage** - Grid display of all battle locations with hover animations
2. **Location Detail Page** - Detailed view with event filtering (All, Upcoming, Past)
3. **All Events Page** - Complete event list with location dropdown and time filters
4. **Event Cards** - Display countdown timer for upcoming events or "Past Event" label
5. **Responsive Design** - Mobile-friendly layout with breakpoints at 768px

### Setup Instructions

#### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

#### Database Setup

1. Create a PostgreSQL database (locally or on Railway/Render)

2. Set up environment variables in `server/.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

3. Run the reset script to create tables and seed data:
```bash
cd server
node config/reset.js
```

#### Backend Setup

1. Install server dependencies:
```bash
cd server
npm install
```

2. Start the Express server:
```bash
npm start
```

The server will run on `http://localhost:5000`

#### Frontend Setup

1. Install client dependencies:
```bash
cd client
npm install
```

2. Start the Vite development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### API Endpoints

- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/locations/:id/events` - Get all events for a specific location

### Technologies Used

**Backend:**
- Node.js
- Express.js v5
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors

**Frontend:**
- React 18
- Vite
- React Router DOM
- CSS3 with animations

### Challenges Faced

- Implementing real-time countdown timers with proper cleanup using useEffect
- Managing filter state across multiple components
- Creating responsive layouts that work on all screen sizes
- Handling database relationships with JOIN queries
- Deploying with proper environment variable configuration

## License

Copyright **2025** **Your Name**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
