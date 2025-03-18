module.exports = (db) => async (req, res) => {
  const { invoice_num } = req.params;
  
  db.run(
    `DELETE FROM invoices WHERE invoice_num = ?`,
    [invoice_num],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Invoice not found" });
      res.json({ message: "Invoice deleted successfully" });
    }
  );
};