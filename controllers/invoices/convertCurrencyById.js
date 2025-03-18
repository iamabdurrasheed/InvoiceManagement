const axios = require("axios");
require('dotenv').config();

module.exports = (db) => async (req, res) => {
  const { id, currency } = req.params;
  
  try {
    // Fixed API URL structure
    const apiUrl = `${process.env.CURRENCY_API_URL}${currency.toUpperCase()}`;
    console.log('Requesting exchange rate for invoice ID:', id);

    const response = await axios.get(apiUrl);
    console.log('API Response:', response.data);

    if (!response.data || response.data.result === 'error') {
      return res.status(400).json({ 
        error: "Invalid currency code",
        details: response.data['error-type'] || "Currency not supported"
      });
    }

    const exchangeRate = response.data.conversion_rate;
    if (!exchangeRate) {
      return res.status(400).json({ 
        error: "Exchange rate not available",
        details: "Could not get conversion rate for the specified currency"
      });
    }

    db.get('SELECT * FROM invoices WHERE id = ?', [id], (err, invoice) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      const convertedInvoice = {
        id: invoice.id,
        purchase_order_number: invoice.purchase_order_number,
        budget_code: invoice.budget_code,
        project_name: invoice.project_name,
        amounts: {
          budget: {
            original: parseFloat(invoice.budget_amount.replace(/[, ]/g, '')),
            original_currency: 'SAR',
            converted: (parseFloat(invoice.budget_amount.replace(/[, ]/g, '')) * exchangeRate).toFixed(2),
            converted_currency: currency.toUpperCase()
          },
          invoice: {
            number: invoice.invoice_num,
            date: invoice.invoice_date,
            original: parseFloat(invoice.invoice_amount.replace(/[, ]/g, '')),
            original_currency: 'SAR',
            converted: (parseFloat(invoice.invoice_amount.replace(/[, ]/g, '')) * exchangeRate).toFixed(2),
            converted_currency: currency.toUpperCase()
          },
          payment: invoice.payment_amount ? {
            original: parseFloat(invoice.payment_amount.replace(/[, ]/g, '')),
            original_currency: 'SAR',
            converted: (parseFloat(invoice.payment_amount.replace(/[, ]/g, '')) * exchangeRate).toFixed(2),
            converted_currency: currency.toUpperCase(),
            status: 'Paid'
          } : {
            status: 'Unpaid'
          }
        }
      };

      res.json({
        meta: {
          timestamp: new Date().toISOString(),
          exchange_rate: exchangeRate,
          base_currency: 'SAR',
          target_currency: currency.toUpperCase(),
          source: 'ExchangeRate-API'
        },
        data: convertedInvoice
      });
    });
  } catch (error) {
    console.error('Currency conversion error:', error.response?.data || error);
    res.status(500).json({ 
      error: "Currency conversion failed",
      details: error.response?.data || error.message
    });
  }
};