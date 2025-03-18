module.exports = (db) => async (req, res) => {
  const { payment_amount } = req.body;
  const payment_status = payment_amount ? 'Paid' : 'Unpaid';

  db.run(
    `UPDATE invoices 
     SET payment_amount = ?,
         payment_status = ?
     WHERE id = ?`,
    [payment_amount, payment_status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Invoice not found" });
      res.json({ 
        message: "Invoice updated successfully",
        payment_status: payment_status
      });
    }
  );
};