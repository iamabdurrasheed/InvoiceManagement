# Invoice API Testing Guide (Thunder Client)

## Setup
1. Install Thunder Client extension in VS Code
2. Create a new Collection named "Invoice API Tests"
3. Set base URL to `http://localhost:3000/api`

## Testing Sequence

### 1. GET All Invoices
- **Method**: GET
- **URL**: `/invoices`
- **Description**: Retrieves all invoices with pagination (page 1)
- **Expected Response**: 200 OK with JSON data containing invoices

### 2. GET Unpaid Invoices
- **Method**: GET
- **URL**: `/invoices/unpaid`
- **Description**: Retrieves only unpaid invoices
- **Expected Response**: 200 OK with JSON data of unpaid invoices

### 3. GET Invoice by ID
- **Method**: GET
- **URL**: `/invoices/id/1`
- **Description**: Retrieves invoice with ID 1
- **Expected Response**: 200 OK with JSON data of the specific invoice

### 4. GET Invoice by Invoice Number
- **Method**: GET
- **URL**: `/invoices/number/MT28000010`
- **Description**: Retrieves invoice with number MT28000010
- **Expected Response**: 200 OK with JSON data of the specific invoice

### 5. Currency Conversion Tests

#### 5.1 Convert All Invoices to Different Currency
- **Method**: GET
- **URL**: `/invoices/convert/EUR`
- **Description**: Converts all invoice amounts to EUR
- **Expected Response**: 200 OK with JSON data containing converted amounts

#### 5.2 Convert Specific Invoice by ID to Different Currency
- **Method**: GET
- **URL**: `/invoices/id/1/convert/EUR`
- **Description**: Converts invoice with ID 1 to EUR
- **Expected Response**: 200 OK with JSON data of invoice with converted amounts

#### 5.3 Convert Specific Invoice by Number to Different Currency
- **Method**: GET
- **URL**: `/invoices/number/MT28000010/convert/EUR`
- **Description**: Converts invoice with number MT28000010 to EUR
- **Expected Response**: 200 OK with JSON data of invoice with converted amounts

### 6. CREATE New Invoice
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

### 7. GET the Created Invoice
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify the invoice was created correctly
- **Expected Response**: 200 OK with JSON data of the new invoice

### 8. UPDATE Invoice by ID
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

### 9. UPDATE Invoice by Invoice Number
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

### 10. Verify Updates
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify all updates were applied correctly
- **Expected Response**: 200 OK with JSON data showing the latest updates

### 11. DELETE Invoice by ID
- **Method**: DELETE
- **URL**: `/invoices/id/{id}` (use the ID of another existing invoice)
- **Description**: Delete an invoice by its ID
- **Expected Response**: 200 OK with success message

### 12. DELETE Invoice by Invoice Number
- **Method**: DELETE
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Delete the test invoice we created
- **Expected Response**: 200 OK with success message

### 13. Verify Deletion
- **Method**: GET
- **URL**: `/invoices/number/TEST-INV-001`
- **Description**: Verify the invoice was deleted
- **Expected Response**: 404 Not Found

## Notes for Testing
- Save each request after testing for reuse
- Use environment variables in Thunder Client to store dynamic values (like created invoice IDs)
- For the currency conversion routes, try different currencies (EUR, GBP, JPY, etc.)
- Test error cases by providing invalid IDs, invoice numbers, or malformed JSON
