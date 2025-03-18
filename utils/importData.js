const fs = require('fs');
const csv = require('csv-parser');

const importData = (db) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (row) => {
        const cleanRow = {
          purchase_order_number: row['Purchase Order Number'] || 'N/A',
          budget_code: row['Budget Code'] || 'N/A',
          budget_amount: row['Budget Amount (SAR)'] ? row['Budget Amount (SAR)'].replace(/[, ]/g, '') : '0',
          project_name: row['Project Name'] || 'N/A',
          invoice_num: row['Invoice Num'] || 'N/A',
          invoice_date: row['Invoice Date'] || '0000-00-00',
          invoice_amount: row['Invoice Amount (SAR)'] ? row['Invoice Amount (SAR)'].replace(/[, ]/g, '') : '0',
          payment_amount: row['Payment Amount (SAR)'] ? row['Payment Amount (SAR)'].replace(/[, ]/g, '') : null,
          payment_status: row['Payment Amount (SAR)'] ? 'Paid' : 'Unpaid'
        };
        rows.push(cleanRow);
      })
      .on('end', () => {
        const stmt = db.prepare(`
          INSERT INTO invoices (
            purchase_order_number,
            budget_code,
            budget_amount,
            project_name,
            invoice_num,
            invoice_date,
            invoice_amount,
            payment_amount,
            payment_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          rows.forEach((row) => {
            stmt.run([
              row.purchase_order_number,
              row.budget_code,
              row.budget_amount,
              row.project_name,
              row.invoice_num,
              row.invoice_date,
              row.invoice_amount,
              row.payment_amount,
              row.payment_status
            ]);
          });
          db.run('COMMIT', (err) => {
            stmt.finalize();
            if (err) {
              console.error('Error importing data:', err);
              reject(err);
            } else {
              console.log('CSV data import completed');
              resolve();
            }
          });
        });
      })
      .on('error', reject);
  });
};

module.exports = importData;