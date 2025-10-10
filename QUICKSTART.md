# Supabase Data Dashboard - Quick Start Guide

## Overview
This is a professional web application that connects to your Supabase database and displays tables in a beautiful, modern interface.

## Two Ways to Use This App

### 1. With Real Supabase Database (index.html)
Open `index.html` in your web browser to connect to the real Supabase database at:
- URL: https://tslcgufxsbglncyxfxie.supabase.co
- The app will automatically discover available tables and display data

### 2. Demo Mode (demo.html)
Open `demo.html` to see how the app works with sample data (no database connection needed).
Includes sample data for:
- Users table
- Products table  
- Orders table

## Features

### Visual Design
- Beautiful purple gradient theme
- Professional table layout with hover effects
- Responsive design that works on all devices
- Smooth animations and transitions

### Data Display
- Column names are automatically formatted (e.g., "created_at" → "Created At")
- Boolean values show as ✓ (true) or ✗ (false)
- Null values display as "-"
- Objects are shown as JSON strings

### User Interface
- **Table Selector**: Dropdown to switch between available tables
- **Refresh Button**: Reload the current table's data
- **Record Count**: Shows how many records are displayed
- **Loading State**: Animated spinner while fetching data
- **Error State**: Clear error messages if something goes wrong

## Browser Requirements
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (for index.html to connect to Supabase)

## Customization

To connect to your own Supabase database:
1. Open `app.js`
2. Update these lines:
   ```javascript
   const SUPABASE_URL = 'your-project-url.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```
3. Save and reload

## Troubleshooting

**Problem**: "No tables found"
- Solution: Ensure your Supabase tables have RLS (Row Level Security) policies that allow public read access, or disable RLS for testing

**Problem**: "Failed to fetch"
- Solution: Check your internet connection and ensure the Supabase URL and API key are correct

**Problem**: Table appears empty
- Solution: Make sure your table has data. Check in Supabase dashboard.

## Technical Details

- **No Build Process**: Just open the HTML file directly
- **No Dependencies**: Uses native JavaScript fetch API
- **Lightweight**: Total size < 25KB for all files
- **Fast**: Loads up to 100 records per table efficiently

## Support

For issues or questions about Supabase configuration, visit:
https://supabase.com/docs

## Demo Data

The demo includes realistic sample data:
- 5 users with different roles and statuses
- 5 products across multiple categories with pricing
- 5 orders with various statuses

This helps you see exactly how the app will look with your real data!
