module.exports = (db) => async (req, res) => {
  db.get(
    `SELECT * FROM invoices WHERE id = ?`, 
    [req.params.id], 
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Invoice not found" });
      res.json(row);
    }
  );
};