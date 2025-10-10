// Demo data for different tables
const demoData = {
    users: [
        { id: 1, username: 'john_doe', email: 'john@example.com', role: 'admin', active: true, created_at: '2024-01-01 08:00:00' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', active: true, created_at: '2024-01-02 09:30:00' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', role: 'user', active: true, created_at: '2024-01-03 10:15:00' },
        { id: 4, username: 'alice_jones', email: 'alice@example.com', role: 'moderator', active: false, created_at: '2024-01-04 11:45:00' },
        { id: 5, username: 'charlie_brown', email: 'charlie@example.com', role: 'user', active: true, created_at: '2024-01-05 13:20:00' }
    ],
    products: [
        { id: 1, name: 'Laptop Pro 15', category: 'Electronics', price: '$1,299.99', in_stock: true, created_at: '2024-01-15 10:30:00' },
        { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: '$29.99', in_stock: true, created_at: '2024-01-16 14:22:00' },
        { id: 3, name: 'USB-C Hub', category: 'Accessories', price: '$49.99', in_stock: true, created_at: '2024-01-17 09:15:00' },
        { id: 4, name: 'Mechanical Keyboard', category: 'Peripherals', price: '$149.99', in_stock: false, created_at: '2024-01-18 16:45:00' },
        { id: 5, name: 'Monitor 27"', category: 'Electronics', price: '$399.99', in_stock: true, created_at: '2024-01-19 11:00:00' }
    ],
    orders: [
        { id: 1001, customer_id: 1, product_id: 1, quantity: 1, total: '$1,299.99', status: 'delivered', order_date: '2024-02-01 10:00:00' },
        { id: 1002, customer_id: 2, product_id: 2, quantity: 2, total: '$59.98', status: 'delivered', order_date: '2024-02-02 11:30:00' },
        { id: 1003, customer_id: 3, product_id: 5, quantity: 1, total: '$399.99', status: 'shipped', order_date: '2024-02-03 14:15:00' },
        { id: 1004, customer_id: 1, product_id: 3, quantity: 3, total: '$149.97', status: 'processing', order_date: '2024-02-04 09:45:00' },
        { id: 1005, customer_id: 4, product_id: 4, quantity: 1, total: '$149.99', status: 'pending', order_date: '2024-02-05 16:20:00' }
    ]
};

// DOM elements
const tableSelect = document.getElementById('tableSelect');
const refreshBtn = document.getElementById('refreshBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const dataContainer = document.getElementById('dataContainer');
const recordCount = document.getElementById('recordCount');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');

// Current table
let currentTable = 'products';

// Load and display data for selected table
function loadTableData(tableName) {
    const data = demoData[tableName];
    
    if (!data || data.length === 0) {
        showError(`No data found in table "${tableName}"`);
        return;
    }
    
    displayData(data, tableName);
}

// Display data in the table
function displayData(data, tableName) {
    // Get column names from the first row
    const columns = Object.keys(data[0]);
    
    // Create table header
    tableHead.innerHTML = '';
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = formatColumnName(column);
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    
    // Create table body
    tableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = formatCellValue(row[column]);
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    
    // Update record count
    recordCount.textContent = `Showing ${data.length} record${data.length !== 1 ? 's' : ''} from "${tableName}"`;
    
    // Show data container
    hideLoading();
    hideError();
    dataContainer.style.display = 'block';
}

// Format column name for display
function formatColumnName(name) {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Format cell value for display
function formatCellValue(value) {
    if (value === null || value === undefined) {
        return '-';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    if (typeof value === 'boolean') {
        return value ? '✓' : '✗';
    }
    return value.toString();
}

// UI State management functions
function showLoading() {
    loadingState.style.display = 'flex';
    errorState.style.display = 'none';
    dataContainer.style.display = 'none';
}

function hideLoading() {
    loadingState.style.display = 'none';
}

function showError(message) {
    errorState.style.display = 'block';
    errorState.querySelector('.error-message').textContent = message;
    loadingState.style.display = 'none';
    dataContainer.style.display = 'none';
}

function hideError() {
    errorState.style.display = 'none';
}

// Event listeners
tableSelect.addEventListener('change', (e) => {
    currentTable = e.target.value;
    loadTableData(currentTable);
});

refreshBtn.addEventListener('click', () => {
    showLoading();
    setTimeout(() => {
        loadTableData(currentTable);
    }, 500);
});

// Initialize with products table
loadTableData('products');
