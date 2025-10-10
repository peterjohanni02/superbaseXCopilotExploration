# Supabase Data Dashboard

A professional web application that connects to a Supabase database and displays table data in a clean, modern interface.

## Features

- 📊 Professional, responsive UI design
- 🔄 Real-time data fetching from Supabase
- 📋 Dynamic table selection
- 🎨 Beautiful gradient design with smooth animations
- 📱 Mobile-friendly responsive layout
- ⚡ Fast and lightweight (no build process required)

## Files

- **index.html** - Main application that connects to Supabase database
- **app.js** - JavaScript logic for Supabase integration and data display
- **styles.css** - Professional styling with gradients and responsive design
- **demo.html** - Demo version with sample data (for testing without database)
- **demo.js** - Demo data and logic

## Quick Start

### Using with Real Supabase Database

1. Simply open `index.html` in a web browser
2. The app will automatically connect to the configured Supabase database
3. Select a table from the dropdown to view its data
4. Click the "Refresh Data" button to reload the current table

### Using the Demo Version

1. Open `demo.html` in a web browser to see the app with sample data
2. Switch between Users, Products, and Orders tables
3. No database connection required

## How It Works

The application uses a custom lightweight Supabase client built with native fetch API, eliminating the need for external dependencies. It:
- Automatically discovers available tables in your database
- Fetches data using Supabase REST API
- Formats and displays data in a professional table layout
- Handles errors gracefully with clear error messages

## Database Configuration

The app is pre-configured to connect to:
- **Supabase URL**: https://tslcgufxsbglncyxfxie.supabase.co
- **Anon Key**: Configured in `app.js`

To use with your own Supabase database, edit the configuration in `app.js`:
```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## Usage with Local Server (Optional)

For the best experience, serve the files with a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Screenshots

### Products Table
![Products View](https://github.com/user-attachments/assets/d5c3aea5-2c19-4eb8-9a49-1398b0a0b99a)

### Users Table
![Users View](https://github.com/user-attachments/assets/28cf332c-d85e-4e08-abf5-5dea1814b790)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Features in Detail

- **Dynamic Table Discovery**: Automatically finds available tables in your database
- **Smart Data Formatting**: 
  - Boolean values displayed as ✓ or ✗
  - Null values displayed as -
  - Column names automatically formatted with proper capitalization
- **Loading States**: Smooth loading animations while fetching data
- **Error Handling**: Clear error messages when issues occur
- **Record Count**: Shows number of records displayed
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Notes

- The app displays up to 100 records per table for performance
- Ensure your Supabase tables have appropriate RLS (Row Level Security) policies configured
- The demo version (`demo.html`) works offline with pre-loaded sample data

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Supabase REST API