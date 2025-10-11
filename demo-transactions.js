// Demo data for Transactions
const transactionsData = [
    { transactionID: 1, transDate: '2024-02-01', custName: 'John Smith', orderTotal: 1500.00, TotalPrice: 0 },
    { transactionID: 2, transDate: '2024-02-02', custName: 'Jane Doe', orderTotal: 2200.50, TotalPrice: 0 },
    { transactionID: 3, transDate: '2024-02-03', custName: 'Bob Wilson', orderTotal: 875.25, TotalPrice: 0 },
    { transactionID: 4, transDate: '2024-02-04', custName: 'Alice Johnson', orderTotal: 3100.00, TotalPrice: 0 },
    { transactionID: 5, transDate: '2024-02-05', custName: 'Charlie Brown', orderTotal: 650.75, TotalPrice: 0 }
];

// Demo data for Transaction Items
const transactionItemsData = [
    // Transaction 1 items
    { itemID: 1, Transaction: 1, itemName: 'Steel Pipe', length: 10.5, price: 25.00 },
    { itemID: 2, Transaction: 1, itemName: 'Copper Wire', length: 50.0, price: 15.00 },
    { itemID: 3, Transaction: 1, itemName: 'Aluminum Sheet', length: 5.5, price: 30.00 },
    
    // Transaction 2 items
    { itemID: 4, Transaction: 2, itemName: 'PVC Pipe', length: 25.0, price: 12.50 },
    { itemID: 5, Transaction: 2, itemName: 'Steel Rod', length: 15.5, price: 40.00 },
    { itemID: 6, Transaction: 2, itemName: 'Brass Fitting', length: 8.0, price: 22.00 },
    { itemID: 7, Transaction: 2, itemName: 'Cable', length: 100.0, price: 8.50 },
    
    // Transaction 3 items
    { itemID: 8, Transaction: 3, itemName: 'Rubber Hose', length: 20.0, price: 18.00 },
    { itemID: 9, Transaction: 3, itemName: 'Metal Bracket', length: 3.5, price: 45.00 },
    
    // Transaction 4 items
    { itemID: 10, Transaction: 4, itemName: 'Wooden Plank', length: 30.0, price: 28.00 },
    { itemID: 11, Transaction: 4, itemName: 'Steel Beam', length: 12.0, price: 75.00 },
    { itemID: 12, Transaction: 4, itemName: 'Concrete Mix', length: 45.0, price: 35.00 },
    { itemID: 13, Transaction: 4, itemName: 'Rebar', length: 18.5, price: 20.00 },
    
    // Transaction 5 items
    { itemID: 14, Transaction: 5, itemName: 'Paint', length: 5.0, price: 55.00 },
    { itemID: 15, Transaction: 5, itemName: 'Tiles', length: 12.5, price: 32.00 }
];

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
let currentTable = 'Transactions';

// Load and display data for selected table
function loadTableData(tableName) {
    if (tableName === 'Transactions') {
        displayData(transactionsData, tableName);
    }
}

// Display data in the table
function displayData(data, tableName) {
    if (!data || data.length === 0) {
        showError('No data to display');
        return;
    }
    
    // For Transactions table, only show specific columns
    let columns;
    if (tableName === 'Transactions') {
        columns = ['transDate', 'custName'];
    } else {
        columns = Object.keys(data[0]);
    }
    
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
        
        // Make transaction rows clickable
        if (tableName === 'Transactions') {
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => openTransactionDetail(row));
            tr.addEventListener('mouseenter', () => {
                tr.style.backgroundColor = '#f0f0f0';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.backgroundColor = '';
            });
        }
        
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
        .join(' ')
        .replace(/([A-Z])/g, ' $1')
        .trim();
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

// Open transaction detail modal
function openTransactionDetail(transaction) {
    const modal = document.getElementById('transactionModal');
    const modalContent = document.getElementById('modalTransactionDetails');
    const itemsTableBody = document.getElementById('modalItemsTableBody');
    
    // Display transaction details
    let detailsHtml = '<h3>Transaction Details</h3><div class="detail-grid">';
    for (const [key, value] of Object.entries(transaction)) {
        detailsHtml += `
            <div class="detail-row">
                <span class="detail-label">${formatColumnName(key)}:</span>
                <span class="detail-value">${formatCellValue(value)}</span>
            </div>
        `;
    }
    detailsHtml += '</div>';
    modalContent.innerHTML = detailsHtml;
    
    // Filter and display transaction items
    const transactionId = transaction.transactionID;
    const items = transactionItemsData.filter(item => item.Transaction == transactionId);
    
    itemsTableBody.innerHTML = '';
    let totalLength = 0;
    let totalCost = 0;
    
    items.forEach(item => {
        const tr = document.createElement('tr');
        
        // Display all fields from the item
        const itemKeys = Object.keys(item);
        itemKeys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = formatCellValue(item[key]);
            tr.appendChild(td);
        });
        
        // Add line price column (length * price)
        const length = parseFloat(item.length || 0);
        const price = parseFloat(item.price || 0);
        const linePrice = length * price;
        
        const linePriceTd = document.createElement('td');
        linePriceTd.textContent = '$' + linePrice.toFixed(2);
        tr.appendChild(linePriceTd);
        
        itemsTableBody.appendChild(tr);
        
        // Accumulate totals
        totalLength += length;
        totalCost += linePrice;
    });
    
    // Add totals row
    if (items.length > 0) {
        const totalRow = document.createElement('tr');
        totalRow.style.fontWeight = 'bold';
        totalRow.style.backgroundColor = '#f0f0f0';
        
        const itemKeys = Object.keys(items[0]);
        itemKeys.forEach((key, index) => {
            const td = document.createElement('td');
            if (key === 'length') {
                td.textContent = `${totalLength.toFixed(2)}`;
            } else if (index === 0) {
                td.textContent = 'TOTALS';
            } else {
                td.textContent = '';
            }
            totalRow.appendChild(td);
        });
        
        // Total cost in line price column
        const totalCostTd = document.createElement('td');
        totalCostTd.textContent = '$' + totalCost.toFixed(2);
        totalRow.appendChild(totalCostTd);
        
        itemsTableBody.appendChild(totalRow);
    }
    
    // Create table header for items
    const itemsTableHead = document.getElementById('modalItemsTableHead');
    if (items.length > 0 && itemsTableHead) {
        itemsTableHead.innerHTML = '';
        const headerRow = document.createElement('tr');
        
        const itemKeys = Object.keys(items[0]);
        itemKeys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = formatColumnName(key);
            headerRow.appendChild(th);
        });
        
        // Add Line Price header
        const linePriceHeader = document.createElement('th');
        linePriceHeader.textContent = 'Line Price';
        headerRow.appendChild(linePriceHeader);
        
        itemsTableHead.appendChild(headerRow);
    }
    
    // Update the transaction with total cost (in demo, just update the data)
    const txIndex = transactionsData.findIndex(t => t.transactionID === transactionId);
    if (txIndex >= 0) {
        transactionsData[txIndex].TotalPrice = totalCost;
        console.log(`Updated transaction ${transactionId} TotalPrice to $${totalCost.toFixed(2)}`);
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Close transaction detail modal
function closeTransactionDetail() {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'none';
}

// Event listeners
tableSelect.addEventListener('change', (e) => {
    currentTable = e.target.value;
    loadTableData(currentTable);
});

refreshBtn.addEventListener('click', () => {
    loadTableData(currentTable);
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('transactionModal');
    if (event.target === modal) {
        closeTransactionDetail();
    }
});

// Initial load
loadTableData(currentTable);
