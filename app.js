// Supabase configuration
const SUPABASE_URL = 'https://tslcgufxsbglncyxfxie.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGNndWZ4c2JnbG5jeXhmeGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTM0MjcsImV4cCI6MjA3NTY2OTQyN30.7an0OkjV-Uz--IyDiIWd8KxK04FcKjjBtGINh2piZk0';

// Simple Supabase client implementation using fetch
class SimpleSupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    from(table) {
        return new QueryBuilder(this.url, this.key, table);
    }
}

class QueryBuilder {
    constructor(url, key, table) {
        this.url = url;
        this.key = key;
        this.table = table;
        this.queryParams = [];
        this.selectFields = '*';
        this.limitValue = null;
        this.filterParams = [];
    }

    select(fields = '*') {
        this.selectFields = fields;
        return this;
    }

    limit(count) {
        this.limitValue = count;
        return this;
    }

    eq(column, value) {
        this.filterParams.push(`${column}=eq.${value}`);
        return this;
    }

    async execute() {
        let url = `${this.url}/rest/v1/${this.table}?select=${this.selectFields}`;
        
        if (this.limitValue) {
            url += `&limit=${this.limitValue}`;
        }

        if (this.filterParams.length > 0) {
            url += '&' + this.filterParams.join('&');
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'apikey': this.key,
                    'Authorization': `Bearer ${this.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async update(updateData) {
        const url = `${this.url}/rest/v1/${this.table}`;
        let fullUrl = url + '?';
        
        if (this.filterParams.length > 0) {
            fullUrl += this.filterParams.join('&');
        }

        try {
            const response = await fetch(fullUrl, {
                method: 'PATCH',
                headers: {
                    'apikey': this.key,
                    'Authorization': `Bearer ${this.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Make the query builder thenable so it can be awaited
    then(resolve, reject) {
        return this.execute().then(resolve, reject);
    }
}

// Initialize Supabase client
const supabase = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const tableSelect = document.getElementById('tableSelect');
const refreshBtn = document.getElementById('refreshBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const dataContainer = document.getElementById('dataContainer');
const recordCount = document.getElementById('recordCount');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');

// State
let currentTable = null;
let availableTables = [];
let transactionsData = [];
let transactionItemsData = [];

// Initialize the application
async function init() {
    try {
        showLoading();
        await loadAvailableTables();
        if (availableTables.length > 0) {
            currentTable = availableTables[0];
            await loadTableData(currentTable);
        } else {
            showError('No tables found in the database. Please create some tables in Supabase.');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showError(`Failed to initialize: ${error.message}`);
    }
}

// Load available tables from Supabase
async function loadAvailableTables() {
    try {
        // Only load Transactions table
        availableTables = ['Transaction'];
        
        // Populate the select dropdown
        tableSelect.innerHTML = '';
        const option = document.createElement('option');
        option.value = 'Transaction';
        option.textContent = 'Transaction';
        option.selected = true;
        tableSelect.appendChild(option);
        
    } catch (error) {
        console.error('Error loading tables:', error);
        // Set a default table
        availableTables = ['Transaction'];
        tableSelect.innerHTML = '<option value="Transactions">Transactions</option>';
    }
}

// Load data from selected table
async function loadTableData(tableName) {
    try {
        showLoading();
        
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(100); // Limit to 100 rows for performance
        
        if (error) {
            throw new Error(`Failed to fetch data from table "${tableName}": ${error.message}`);
        }
        
        if (!data || data.length === 0) {
            showError(`No data found in table "${tableName}". The table might be empty.`);
            return;
        }

        // If loading Transactions, also load Transaction Items
        if (tableName === 'Transaction') {
            transactionsData = data;
            try {
                const { data: itemsData, error: itemsError } = await supabase
                    .from('Transaction Items')
                    .select('*');
                
                if (!itemsError && itemsData) {
                    transactionItemsData = itemsData;
                }
            } catch (e) {
                console.warn('Could not load Transaction Items:', e);
            }
        }
        
        displayData(data, tableName);
        
    } catch (error) {
        console.error('Error loading table data:', error);
        showError(error.message);
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
    if (tableName === 'Transaction') {
        columns = ['transDate', 'custName'];
    } else {
        // Get column names from the first row
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
        if (tableName === 'Transaction') {
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

// Open transaction detail modal
async function openTransactionDetail(transaction) {
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
        linePriceTd.textContent = linePrice.toFixed(2);
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
                td.textContent = `Total: ${totalLength.toFixed(2)}`;
            } else if (index === 0) {
                td.textContent = 'TOTALS';
            } else {
                td.textContent = '';
            }
            totalRow.appendChild(td);
        });
        
        // Total cost in line price column
        const totalCostTd = document.createElement('td');
        totalCostTd.textContent = totalCost.toFixed(2);
        totalRow.appendChild(totalCostTd);
        
        itemsTableBody.appendChild(totalRow);
    }
    
    // Create table header for items if not exists
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
    
    // Update the transaction with total cost
    if (totalCost > 0) {
        try {
            await supabase
                .from('Transaction')
                .eq('transactionID', transactionId)
                .update({ TotalPrice: totalCost });
        } catch (error) {
            console.error('Error updating TotalPrice:', error);
        }
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
tableSelect.addEventListener('change', async (e) => {
    currentTable = e.target.value;
    await loadTableData(currentTable);
});

refreshBtn.addEventListener('click', async () => {
    if (currentTable) {
        await loadTableData(currentTable);
    }
});

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
