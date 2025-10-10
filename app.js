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
    }

    select(fields = '*') {
        this.selectFields = fields;
        return this;
    }

    limit(count) {
        this.limitValue = count;
        return this;
    }

    async execute() {
        let url = `${this.url}/rest/v1/${this.table}?select=${this.selectFields}`;
        
        if (this.limitValue) {
            url += `&limit=${this.limitValue}`;
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
        // Try to find tables by attempting to query them
        const commonTableNames = ['exampletable1', 'users', 'profiles', 'posts', 'products', 'items', 'data', 'records', 'employees', 'customers', 'orders', 'transactions'];
        const foundTables = [];
        
        for (const tableName of commonTableNames) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);
                
                if (!error && data !== null) {
                    foundTables.push(tableName);
                }
            } catch (e) {
                // Table doesn't exist or no permission
                continue;
            }
        }
        
        if (foundTables.length > 0) {
            availableTables = foundTables;
        } else {
            // Default to trying a generic table name
            availableTables = ['data'];
        }
        
        // Populate the select dropdown
        tableSelect.innerHTML = '';
        availableTables.forEach(table => {
            const option = document.createElement('option');
            option.value = table;
            option.textContent = table.charAt(0).toUpperCase() + table.slice(1);
            tableSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading tables:', error);
        // Set a default table
        availableTables = ['data'];
        tableSelect.innerHTML = '<option value="data">Data</option>';
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
