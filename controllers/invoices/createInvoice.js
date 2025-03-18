module.exports = (db) => async (req, res) => {
  const {
    purchase_order_number,
    budget_code,
    budget_amount,
    project_name,
    invoice_num,
    invoice_date,
    invoice_amount,
    payment_amount
  } = req.body;

  const payment_status = payment_amount ? 'Paid' : 'Unpaid';

  db.run(
    `INSERT INTO invoices (
      purchase_order_number,
      budget_code,
      budget_amount,
      project_name,
      invoice_num,
      invoice_date,
      invoice_amount,
      payment_amount,
      payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      purchase_order_number,
      budget_code,
      budget_amount,
      project_name,
      invoice_num,
      invoice_date,
      invoice_amount,
      payment_amount,
      payment_status
    ],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        ...req.body,
        payment_status
      });
    }
  );
};