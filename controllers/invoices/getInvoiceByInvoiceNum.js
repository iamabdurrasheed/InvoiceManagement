module.exports = (db) => async (req, res) => {
  const { invoice_num } = req.params;
  
  db.get(
    `SELECT * FROM invoices WHERE invoice_num = ?`, 
    [invoice_num], 
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Invoice not found" });
      res.json(row);
    }
  );
};