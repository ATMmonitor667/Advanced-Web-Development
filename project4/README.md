# WEB103 Project 4 - *DIY Delight - Custom Car Builder*

Submitted by: **Your Name**

About this web app: **A custom car builder application where users can design their dream car by selecting from various exterior colors, roof types, wheels, and interior options. The app calculates the total price dynamically and validates feature combinations to prevent incompatible selections.**

Time spent: **X** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured CustomItem table**
- [x] **Users can view multiple features of the CustomItem (car) they can customize (exterior, roof, wheels, interior)**
- [x] **Each customizable feature has multiple options to choose from**
  - [x] Exterior: 6 color options (Black, Red, Blue, White, Silver, Green)
  - [x] Roof: 5 types (Standard, Sunroof, Panoramic, Convertible Soft/Hard Top)
  - [x] Wheels: 5 options (16"-20" with various styles)
  - [x] Interior: 7 options (Cloth, Leather, Alcantara in various colors)
- [x] **On selecting each option, the displayed visual icon for the CustomItem updates to match the option the user chose**
- [x] **The price of the CustomItem changes dynamically as different options are selected**
- [x] **The visual interface changes in response to at least one customizable feature (roof type affects car visual)**
- [x] **The user can submit their choices to save the item to the list of created CustomItems**
- [x] **If a user submits a feature combo that is impossible, they receive an appropriate error message and the item is not saved**
  - [x] Validation: Convertible roofs cannot have sunroof options
- [x] **Users can view a list of all submitted CustomItems**
- [x] **Users can edit a submitted CustomItem from the list view**
- [x] **Users can delete a submitted CustomItem from the list view**
- [x] **Users can update or delete CustomItems from the detail page**

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with **ScreenToGif** for Windows or **LICEcap** for macOS.

## Notes

### Features Implemented

1. **Dynamic Car Customization**
   - Real-time visual updates based on selected options
   - Car color changes with exterior selection
   - Roof type affects visual (convertible, sunroof icons)
   - Interior color affects border color
   - Wheels display different icons

2. **Price Calculation**
   - Base price: $40,000
   - Dynamic pricing based on selected options
   - Real-time price updates
   - Formatted as USD currency

3. **Validation System**
   - Prevents incompatible feature combinations
   - Error messages for invalid selections
   - Server-side validation in addition to client-side

4. **Full CRUD Operations**
   - Create: Build custom cars with unique names
   - Read: View all cars in garage, view individual car details
   - Update: Edit existing car configurations
   - Delete: Remove cars from garage (with confirmation)

5. **Pages**
   - **Create Car**: Interactive builder with live preview
   - **My Garage (All Cars)**: Grid view of all created cars
   - **View Car Details**: Full specifications and large visual
   - **Edit Car**: Modify existing car configurations

### Database Schema

**custom_cars** table:
- id, name, exterior_id, roof_id, wheels_id, interior_id, total_price, created_at

**Options tables**:
- **exteriors**: id, name, color, price, image_url
- **roofs**: id, name, type, price, convertible
- **wheels**: id, name, size, price, image_url
- **interiors**: id, name, material, color, price

### API Endpoints

**Cars:**
- `GET /api/cars` - Get all custom cars with full details
- `GET /api/cars/:id` - Get single car by ID
- `POST /api/cars` - Create new custom car
- `PATCH /api/cars/:id` - Update existing car
- `DELETE /api/cars/:id` - Delete car

**Options:**
- `GET /api/exteriors` - Get all exterior options
- `GET /api/roofs` - Get all roof options
- `GET /api/wheels` - Get all wheel options
- `GET /api/interiors` - Get all interior options

### Setup Instructions

#### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

#### Database Setup

1. Create a PostgreSQL database on Render or locally

2. Set up environment variables in `server/.env`:
```env
PGUSER=your_username
PGPASSWORD=your_password
PGHOST=your_host
PGPORT=5432
PGDATABASE=your_database
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

The server will run on `http://localhost:3000`

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
- Custom CSS with gradients

### Challenges Faced

- Implementing dynamic visual updates that reflect all customization choices
- Creating validation logic for incompatible feature combinations
- Managing state across multiple customization options
- Designing an intuitive UI for car building
- Calculating prices dynamically across multiple components

## License

Copyright **2025** **Your Name**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
