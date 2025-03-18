const express = require("express");
const cors = require("cors");
const invoiceRoutes = require("./routes/invoices");
const importData = require("./utils/importData");
const initializeDatabase = require("./database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize database and start server
async function startServer() {
  try {
    const db = await initializeDatabase();
    
    // Pass db instance to routess
    app.use("/api/invoices", invoiceRoutes(db));
    
    // Import data after database is initialized for better error handling
    await importData(db);
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
