module.exports = (db) => async (req, res) => {
  db.run(
    `DELETE FROM invoices WHERE id = ?`,
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Invoice not found" });
      res.json({ message: "Invoice deleted successfully" });
    }
  );
};