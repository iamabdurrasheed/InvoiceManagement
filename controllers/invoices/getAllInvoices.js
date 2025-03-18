module.exports = (db) => async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Get total counts and paid/unpaid counts
    db.all(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN payment_amount IS NOT NULL THEN 1 ELSE 0 END) AS paid,
        SUM(CASE WHEN payment_amount IS NULL THEN 1 ELSE 0 END) AS unpaid
      FROM invoices`, 
      (err, [counts]) => {
        if (err) return res.status(500).json({ error: err.message });

        const totalRecords = counts.total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Get paginated data
        db.all(
          `SELECT * FROM invoices LIMIT ? OFFSET ?`,
          [limit, offset],
          (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              totalRecords,
              totalPages,
              currentPage: Number(page),
              pageSize: Number(limit),
              summary: {
                // total: counts.total,
                paid: counts.paid,
                unpaid: counts.unpaid
              },
              data: rows
            });
          }
        );
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
