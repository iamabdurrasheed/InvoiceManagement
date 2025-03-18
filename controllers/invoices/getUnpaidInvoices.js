module.exports = (db) => async (req, res) => {
  db.all(
    `SELECT * FROM invoices WHERE payment_amount IS NULL`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};