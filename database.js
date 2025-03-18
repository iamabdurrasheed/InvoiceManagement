const sqlite3 = require("sqlite3").verbose();

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./invoices.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error("Error opening database", err.message);
        reject(err);
        return;
      }
      console.log("Connected to SQLite database.");
      
      // Drop existing table if it exists
      db.run("DROP TABLE IF EXISTS invoices", (err) => {
        if (err) {
          console.error("Error dropping table:", err.message);
          reject(err);
          return;
        }
        // Create new table
        db.run(
          `CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            purchase_order_number TEXT NOT NULL,
            budget_code TEXT NOT NULL,
            budget_amount TEXT NOT NULL,
            project_name TEXT NOT NULL,
            invoice_num TEXT NOT NULL UNIQUE,
            invoice_date TEXT NOT NULL,
            invoice_amount TEXT NOT NULL,
            payment_amount TEXT,
            payment_status TEXT DEFAULT 'Unpaid'
          )`,
          (err) => {
            if (err) {
              reject(err);
            } else {
              // Add this after creating the invoices table
              db.run(`
                CREATE TRIGGER IF NOT EXISTS update_payment_status
                AFTER UPDATE ON invoices
                BEGIN
                  UPDATE invoices 
                  SET payment_status = CASE 
                    WHEN NEW.payment_amount IS NOT NULL AND NEW.payment_amount != '' THEN 'Paid'
                    ELSE 'Unpaid'
                  END
                  WHERE id = NEW.id;
                END;
              `, (err) => {
                if (err) {
                  reject(err);
                } else {
                  // Add this after the previous trigger
                  db.run(`
                    CREATE TRIGGER IF NOT EXISTS set_initial_payment_status
                    AFTER INSERT ON invoices
                    BEGIN
                      UPDATE invoices 
                      SET payment_status = CASE 
                        WHEN NEW.payment_amount IS NOT NULL AND NEW.payment_amount != '' THEN 'Paid'
                        ELSE 'Unpaid'
                      END
                      WHERE id = NEW.id;
                    END;
                  `, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(db);
                    }
                  });
                }
              });
            }
          }
        );
      });
    });
  });
};

module.exports = initializeDatabase;
