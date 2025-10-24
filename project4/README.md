# WEB103 Project 4 - DIY Delight: Custom Car Builder

🚗 **BOLT BUCKET** - Build your dream car with our interactive customization tool!

## 📋 Overview

BOLT BUCKET is a full-stack web application that allows users to create, view, edit, and delete custom car configurations. Users can select from various options for exterior color, wheels, interior, and engine type, with real-time price calculations and visual feedback.

### ✨ Key Features

- ✅ **Create Custom Cars**: Select from multiple options for each feature (Exterior, Wheels, Interior, Engine)
- ✅ **Real-time Price Calculation**: See the total price update as you make selections
- ✅ **Validation**: Incompatible combinations are prevented (e.g., Electric engine with Sport wheels)
- ✅ **View Gallery**: Browse all custom car builds in a responsive grid layout
- ✅ **Detailed View**: See full specifications and metadata for each car
- ✅ **Edit Cars**: Update existing configurations with ease
- ✅ **Delete Cars**: Remove configurations with confirmation modal
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🎬 Video Walkthrough

Here's a walkthrough of implemented required features:

### Creating a Custom Car
<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Creating a Car' width='' alt='Creating a Car' />

### Viewing All Cars
<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Viewing Cars' width='' alt='Viewing Cars' />

### Editing and Deleting
<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Edit and Delete' width='' alt='Edit and Delete' />

GIF created with **ScreenToGif**

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **PostgreSQL** database (Render or local)
- **npm** or **yarn**

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd web103_unit4_project
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
\`\`\`env
PGUSER=your_database_user
PGPASSWORD=your_database_password
PGHOST=your_database_host
PGPORT=5432
PGDATABASE=your_database_name
\`\`\`

### 4. Initialize Database
Run the reset script to create tables and seed data:
\`\`\`bash
cd server
node reset.js
\`\`\`

### 5. Start Development Servers
\`\`\`bash
npm run dev
\`\`\`

This starts:
- **Client** (Vite + React): http://localhost:5173
- **Server** (Express): http://localhost:3000

## 📁 Project Structure

\`\`\`
web103_unit4_project/
├── client/
│   └── src/
│       ├── components/
│       │   └── Navigation.jsx
│       ├── css/
│       │   ├── CreateCar.css
│       │   ├── ViewCars.css
│       │   ├── CarDetails.css
│       │   └── Navigation.css
│       ├── pages/
│       │   ├── CreateCar.jsx
│       │   ├── ViewCars.jsx
│       │   ├── CarDetails.jsx
│       │   └── EditCar.jsx
│       ├── services/
│       │   ├── CarsAPI.jsx
│       │   └── OptionsAPI.jsx
│       ├── utilities/
│       │   ├── priceCalculator.js
│       │   └── validation.js
│       └── App.jsx
├── server/
│   ├── controllers/
│   │   ├── customItemsController.js
│   │   └── optionsController.js
│   ├── routes/
│   │   ├── customItems.js
│   │   └── options.js
│   ├── database.js
│   ├── init.sql
│   ├── reset.js
│   └── server.js
├── .env
├── package.json
└── README.md
\`\`\`

## 🗄️ Database Schema

### Tables

#### `features`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique feature ID |
| name | TEXT | Feature name (e.g., "Exterior Color") |

#### `options`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique option ID |
| feature_id | INTEGER | Foreign key to features |
| name | TEXT | Option name (e.g., "Red") |
| price | DECIMAL | Option price |
| icon_class | TEXT | Font Awesome icon class |

#### `custom_items`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique car ID |
| name | TEXT | Custom car name |
| total_price | DECIMAL | Total price |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

#### `item_selections`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique selection ID |
| custom_item_id | INTEGER | Foreign key to custom_items |
| feature_id | INTEGER | Foreign key to features |
| option_id | INTEGER | Foreign key to options |

### Sample Data
- **4 Features**: Exterior Color, Wheels, Interior, Engine
- **14 Options**: Various colors, wheel types, interiors, and engines with prices ranging from $500 to $10,000

## 🔌 API Endpoints

### Custom Items
- `GET /api/custom-items` - Get all custom cars
- `GET /api/custom-items/:id` - Get a specific car
- `POST /api/custom-items` - Create a new car
- `PUT /api/custom-items/:id` - Update a car
- `DELETE /api/custom-items/:id` - Delete a car

### Options
- `GET /api/options/features` - Get all features with their options
- `GET /api/options` - Get all options
- `GET /api/options/feature/:featureId` - Get options for a specific feature

## 🎨 Frontend Features

### Pages
1. **CreateCar** (`/`) - Build a new custom car
2. **ViewCars** (`/customcars`) - Gallery of all cars
3. **CarDetails** (`/customcars/:id`) - Detailed view of a specific car
4. **EditCar** (`/edit/:id`) - Edit an existing car

### Validation Rules
- ✅ Car name required (3-50 characters)
- ✅ All features must have a selection
- ✅ Incompatible combinations prevented (Electric + Sport wheels)

### Price Calculator
- Dynamic total price calculation
- Currency formatting (USD)
- Real-time updates as options change

## 🚀 Technologies Used

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool
- **CSS3** - Styling with custom animations
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## 📝 Development Scripts

\`\`\`bash
# Install dependencies
npm install

# Start development servers (client + server)
npm run dev

# Start production server
npm start

# Build client for production
npm run build

# Reset database
cd server && node reset.js
\`\`\`

## 🎯 Future Enhancements

- [ ] Add image uploads for custom cars
- [ ] Implement user authentication
- [ ] Add favorites/wishlist feature
- [ ] Export configurations as PDF
- [ ] Add more features (Accessories, Performance upgrades)
- [ ] Implement search and filter functionality
- [ ] Add comparison tool for multiple cars

## 📄 License

This project is part of CodePath WEB103 curriculum.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- CodePath WEB103 Team
- Font Awesome for icons
- Render for database hosting

---

Made with ❤️ for WEB103 Project 4