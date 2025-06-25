# Invoice Management API 💼

A robust RESTful API for managing invoices with features including CRUD operations, currency conversion, payment tracking, and data import from CSV files. Built with Node.js, Express, and SQLite.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete invoices
- **Flexible Search**: Find invoices by ID or invoice number
- **Payment Tracking**: Automatic payment status management with database triggers
- **Currency Conversion**: Real-time currency conversion using external API
- **Data Import**: Automatic CSV data import on startup
- **Pagination**: Efficient data retrieval with pagination support
- **Database Statistics**: Get paid/unpaid invoice counts and totals
- **Error Handling**: Comprehensive error handling and validation

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   CURRENCY_API_URL=https://v6.exchangerate-api.com/v6/YOUR_API_KEY/pair/SAR/
   ```

4. **Prepare your data**
   Ensure your `data.csv` file is in the root directory with the following structure:
   ```csv
   Purchase Order Number,Budget Code,Budget Amount (SAR),Project Name,Invoice Num,Invoice Date,Invoice Amount (SAR),Payment Amount (SAR)
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npx nodemon server.js
   ```

The server will start on `http://localhost:3000` (or your specified PORT).

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 3000 |
| `CURRENCY_API_URL` | Exchange rate API base URL | Yes | - |

### CSV Data Format

The application expects a CSV file (`data.csv`) with these columns:
- Purchase Order Number
- Budget Code
- Budget Amount (SAR)
- Project Name
- Invoice Num
- Invoice Date
- Invoice Amount (SAR)
- Payment Amount (SAR) (optional)

## 🗄️ Database Schema

The application uses SQLite with the following schema:

```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_order_number TEXT NOT NULL,
  budget_code TEXT NOT NULL,
  budget_amount TEXT NOT NULL,
  project_name TEXT NOT NULL,
  invoice_num TEXT NOT NULL UNIQUE,
  invoice_date TEXT NOT NULL,
  invoice_amount TEXT NOT NULL,
  payment_amount TEXT,
  payment_status TEXT DEFAULT 'Unpaid'
);
```

### Database Triggers

- **Update Payment Status**: Automatically updates payment status when payment_amount is modified
- **Initial Payment Status**: Sets initial payment status when new invoices are inserted

## 🔗 API Endpoints

Base URL: `http://localhost:3000/api/invoices`

### Invoice Management

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/` | Get all invoices with pagination | `page`, `limit` |
| GET | `/unpaid` | Get all unpaid invoices | - |
| GET | `/id/:id` | Get invoice by ID | `id` (path) |
| GET | `/number/:invoice_num` | Get invoice by invoice number | `invoice_num` (path) |
| POST | `/` | Create new invoice | JSON body |
| PUT | `/id/:id` | Update invoice by ID | `id` (path), JSON body |
| PUT | `/number/:invoice_num` | Update invoice by invoice number | `invoice_num` (path), JSON body |
| DELETE | `/id/:id` | Delete invoice by ID | `id` (path) |
| DELETE | `/number/:invoice_num` | Delete invoice by invoice number | `invoice_num` (path) |

### Currency Conversion

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/convert/:currency` | Convert all invoices to specified currency | `currency` (path) |
| GET | `/id/:id/convert/:currency` | Convert specific invoice by ID | `id`, `currency` (path) |
| GET | `/number/:invoice_num/convert/:currency` | Convert specific invoice by number | `invoice_num`, `currency` (path) |

### Request/Response Examples

#### Create Invoice
```json
POST /api/invoices
{
  "purchase_order_number": "PO-12345",
  "budget_code": "IT-2024-001",
  "budget_amount": "100000.00",
  "project_name": "Sample Project",
  "invoice_num": "INV-001",
  "invoice_date": "2024-01-15",
  "invoice_amount": "50000.00",
  "payment_amount": "50000.00"
}
```

#### Get All Invoices Response
```json
{
  "totalRecords": 65,
  "totalPages": 7,
  "currentPage": 1,
  "pageSize": 10,
  "summary": {
    "paid": 58,
    "unpaid": 7
  },
  "data": [
    {
      "id": 1,
      "purchase_order_number": "PO-00890",
      "budget_code": "IT-2023-222021-300010000",
      "budget_amount": "165698.00",
      "project_name": "ZoneInnovate: The SEZ Advancement Initiative",
      "invoice_num": "MT28000010",
      "invoice_date": "30-Jul-23",
      "invoice_amount": "97750.00",
      "payment_amount": "97750.00",
      "payment_status": "Paid"
    }
  ]
}
```

#### Currency Conversion Response
```json
{
  "currency": "EUR",
  "exchange_rate": 0.25,
  "conversion_date": "2024-01-15T10:30:00Z",
  "data": [
    {
      "id": 1,
      "invoice_num": "MT28000010",
      "original_amount_sar": "97750.00",
      "converted_amount_eur": "24437.50",
      "budget_amount_converted": "41424.50"
    }
  ]
}
```

## 💡 Usage Examples

### Basic Operations

```javascript
// Get all invoices with pagination
fetch('http://localhost:3000/api/invoices?page=1&limit=20')
  .then(response => response.json())
  .then(data => console.log(data));

// Get unpaid invoices
fetch('http://localhost:3000/api/invoices/unpaid')
  .then(response => response.json())
  .then(data => console.log(data));

// Convert invoice amounts to USD
fetch('http://localhost:3000/api/invoices/convert/USD')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Creating an Invoice

```javascript
const newInvoice = {
  purchase_order_number: "PO-12345",
  budget_code: "IT-2024-001",
  budget_amount: "100000.00",
  project_name: "Sample Project",
  invoice_num: "INV-001",
  invoice_date: "2024-01-15",
  invoice_amount: "50000.00"
};

fetch('http://localhost:3000/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newInvoice)
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📁 Project Structure

```
invoice_api/
├── controllers/
│   └── invoices/
│       ├── index.js                    # Controller exports
│       ├── getAllInvoices.js           # Get all invoices with pagination
│       ├── getInvoiceById.js           # Get invoice by ID
│       ├── getInvoiceByInvoiceNum.js   # Get invoice by invoice number
│       ├── getUnpaidInvoices.js        # Get unpaid invoices
│       ├── createInvoice.js            # Create new invoice
│       ├── updateInvoice.js            # Update invoice by ID
│       ├── updateInvoiceByInvoiceNum.js # Update invoice by number
│       ├── deleteInvoice.js            # Delete invoice by ID
│       ├── deleteInvoiceByInvoiceNum.js # Delete invoice by number
│       ├── convertCurrency.js          # Convert all invoices currency
│       ├── convertCurrencyById.js      # Convert single invoice by ID
│       └── convertCurrencyByInvoiceNum.js # Convert single invoice by number
├── routes/
│   └── invoices.js                     # Invoice routes definition
├── utils/
│   └── importData.js                   # CSV data import utility
├── data.csv                            # Sample invoice data
├── database.js                         # Database initialization
├── server.js                           # Main server file
├── package.json                        # Project dependencies
├── invoices.db                         # SQLite database (auto-generated)
└── thunderclient-testing-guide.md     # API testing guide
```

### Key Components

- **Controllers**: Handle business logic for each endpoint
- **Routes**: Define API endpoints and map them to controllers
- **Database**: SQLite database with automatic initialization and triggers
- **Utils**: Helper functions for data import and processing
- **Server**: Express server setup with middleware and error handling

## 🧪 Testing

### Using Thunder Client (VS Code Extension)

Thunder Client is a lightweight REST API client extension for VS Code. Follow this comprehensive testing guide to test all API endpoints:

#### Setup
1. Install Thunder Client extension in VS Code
2. Create a new Collection named "Invoice API Tests"
3. Set base URL to `http://localhost:3000/api`

#### Testing Sequence

##### 1. GET All Invoices
- **Method**: GET
- **URL**: `/invoices`
- **Description**: Retrieves all invoices with pagination (page 1)
- **Expected Response**: 200 OK with JSON data containing invoices

##### 2. GET Unpaid Invoices
- **Method**: GET
- **URL**: `/invoices/unpaid`
- **Description**: Retrieves only unpaid invoices
- **Expected Response**: 200 OK with JSON data of unpaid invoices

##### 3. GET Invoice by ID
- **Method**: GET
- **URL**: `/invoices/id/1`
- **Description**: Retrieves invoice with ID 1
- **Expected Response**: 200 OK with JSON data of the specific invoice

##### 4. GET Invoice by Invoice Number
- **Method**: GET
- **URL**: `/invoices/number/MT28000010`
- **Description**: Retrieves invoice with number MT28000010
- **Expected Response**: 200 OK with JSON data of the specific invoice

##### 5. Currency Conversion Tests

###### 5.1 Convert All Invoices to Different Currency
- **Method**: GET
- **URL**: `/invoices/convert/EUR`
- **Description**: Converts all invoice amounts to EUR
- **Expected Response**: 200 OK with JSON data containing converted amounts

###### 5.2 Convert Specific Invoice by ID to Different Currency
- **Method**: GET
- **URL**: `/invoices/id/1/convert/EUR`
- **Description**: Converts invoice with ID 1 to EUR
- **Expected Response**: 200 OK with JSON data of invoice with converted amounts

###### 5.3 Convert Specific Invoice by Number to Different Currency
- **Method**: GET
- **URL**: `/invoices/number/MT28000010/convert/EUR`
- **Description**: Converts invoice with number MT28000010 to EUR
- **Expected Response**: 200 OK with JSON data of invoice with converted amounts

##### 6. CREATE New Invoice
- **Method**: POST
- **URL**: `/invoices`
- **Body Type**: JSON
- **Body Content**:
```json
{
  "purchase_order_number": "TEST-001",
  "budget_code": "TEST-2023-123456-100000000",
  "budget_amount": "500000.00",
  "project_name": "API Testing Project",
  "invoice_num": "TEST-INV-001",
  "invoice_date": "26-Feb-25",
  "invoice_amount": "75000.00",
  "payment_amount": "0.00",
  "payment_status": "Unpaid"
}
```
- **Expected Response**: 201 Created with JSON data of the new invoice

##### 7. GET the Created Invoice
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify the invoice was created correctly
- **Expected Response**: 200 OK with JSON data of the new invoice

##### 8. UPDATE Invoice by ID
- **Method**: PUT
- **URL**: `/invoices/id/{id}` (use the ID returned from the creation step)
- **Description**: Update invoice details
- **Body Type**: JSON
- **Body Content**:
```json
{
  "invoice_amount": "80000.00",
  "payment_amount": "40000.00",
  "payment_status": "Partial"
}
```
- **Expected Response**: 200 OK with JSON data of the updated invoice

##### 9. UPDATE Invoice by Invoice Number
- **Method**: PUT
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Update more invoice details
- **Body Type**: JSON
- **Body Content**:
```json
{
  "payment_amount": "80000.00",
  "payment_status": "Paid"
}
```
- **Expected Response**: 200 OK with JSON data of the updated invoice

##### 10. Verify Updates
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify all updates were applied correctly
- **Expected Response**: 200 OK with JSON data showing the latest updates

##### 11. DELETE Invoice by ID
- **Method**: DELETE
- **URL**: `/invoices/id/{id}` (use the ID of another existing invoice)
- **Description**: Delete an invoice by its ID
- **Expected Response**: 200 OK with success message

##### 12. DELETE Invoice by Invoice Number
- **Method**: DELETE
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Delete the test invoice we created
- **Expected Response**: 200 OK with success message

##### 13. Verify Deletion
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify the invoice was deleted
- **Expected Response**: 404 Not Found

#### Testing Tips
- Save each request after testing for reuse
- Use environment variables in Thunder Client to store dynamic values (like created invoice IDs)
- For currency conversion routes, try different currencies (EUR, GBP, JPY, etc.)
- Test error cases by providing invalid IDs, invoice numbers, or malformed JSON

### Manual Testing with cURL

You can also test the API using cURL commands:

```bash
# Get all invoices
curl http://localhost:3000/api/invoices

# Get unpaid invoices
curl http://localhost:3000/api/invoices/unpaid

# Get invoice by ID
curl http://localhost:3000/api/invoices/id/1

# Convert to EUR
curl http://localhost:3000/api/invoices/convert/EUR

# Create new invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_order_number": "TEST-001",
    "budget_code": "TEST-2023-123456-100000000",
    "budget_amount": "500000.00",
    "project_name": "API Testing Project",
    "invoice_num": "TEST-INV-001",
    "invoice_date": "26-Feb-25",
    "invoice_amount": "75000.00"
  }'

# Update invoice
curl -X PUT http://localhost:3000/api/invoices/id/1 \
  -H "Content-Type: application/json" \
  -d '{
    "payment_amount": "50000.00",
    "payment_status": "Paid"
  }'

# Delete invoice
curl -X DELETE http://localhost:3000/api/invoices/id/1
```

## 🔧 Dependencies

### Production Dependencies
- **express**: Web application framework
- **sqlite3**: SQLite database driver
- **cors**: Cross-origin resource sharing middleware
- **csv-parser**: CSV file parsing utility
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Development server with auto-reload

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Database or server errors

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

## 🔄 Database Features

### Automatic Payment Status Management
- Database triggers automatically update payment status
- Payment status is set to "Paid" when payment_amount is provided
- Payment status is set to "Unpaid" when payment_amount is null or empty

### Data Import
- CSV data is automatically imported on server startup
- Existing data is cleared and replaced with CSV data
- Amount values are cleaned (commas and spaces removed)

## 🌐 Currency Conversion

The API supports real-time currency conversion using an external exchange rate API:

- Base currency: Saudi Riyal (SAR)
- Supports conversion to any major currency
- Returns both original and converted amounts
- Includes exchange rate and conversion timestamp

## 📈 Performance Features

- **Pagination**: Efficient data retrieval with configurable page sizes
- **Database Indexing**: Unique index on invoice_num for fast lookups
- **Transaction Management**: Batch operations for data import
- **Connection Pooling**: Persistent database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

---

Made with ❤️ for efficient invoice management
