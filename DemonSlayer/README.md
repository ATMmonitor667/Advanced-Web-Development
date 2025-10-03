# WEB103 Project 2 - *Demon Slayer Characters*

Submitted by: **ATM Rahat Hossain**

This web app: **displays a collection of Demon Slayer characters with their power stats, breathing techniques, and detailed information stored in a PostgreSQL database.**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses only HTML, CSS, and JavaScript on the frontend**
- [x] **The web app is connected to a PostgreSQL database**
- [x] **The web app displays data from the PostgreSQL database**

The following **optional** features are implemented:

- [x] The user can search for characters by name or breathing technique
- [x] Character cards display power, speed, durability, and intelligence stats
- [x] Individual character detail pages with complete information
- [x] Responsive design using PicoCSS framework
- [x] Custom 404 error page with Demon Slayer theme

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with **LICEcap**
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

This project refactors a Week 1 listicle application to use a PostgreSQL database instead of static data. The database contains Demon Slayer characters with attributes including power, speed, durability, intelligence, breathing techniques, and character images stored in Supabase.

Key implementation details:
- **Backend**: Express.js server with PostgreSQL connection using node-postgres (pg)
- **Database**: PostgreSQL table `demonslayer` with character data
- **Frontend**: Vanilla HTML/CSS/JavaScript with PicoCSS for styling
- **Features**: Character listing, search functionality, individual detail pages, and responsive design
- **API Endpoints**: 
  - `GET /api` - Returns all characters sorted by power
  - `GET /api/name/:name` - Returns specific character by name

