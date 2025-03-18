const express = require("express");
const createControllers = require("../controllers/invoices");

module.exports = (db) => {
  const router = express.Router();
  const controllers = createControllers(db);

  // CRUD routes
  router.get("/", controllers.getAllInvoices);
  router.get("/unpaid", controllers.getUnpaidInvoices);
  router.get("/id/:id", controllers.getInvoiceById);
  router.get("/number/:invoice_num", controllers.getInvoiceByInvoiceNum);
  router.post("/", controllers.createInvoice);
  router.put("/id/:id", controllers.updateInvoice);
  router.put("/number/:invoice_num", controllers.updateInvoiceByInvoiceNum);
  router.delete("/id/:id", controllers.deleteInvoice);
  router.delete("/number/:invoice_num", controllers.deleteInvoiceByInvoiceNum);

  // Currency conversion routes
  router.get("/convert/:currency", controllers.convertCurrency);
  router.get("/id/:id/convert/:currency", controllers.convertCurrencyById);
router.get("/number/:invoice_num/convert/:currency", controllers.convertCurrencyByInvoiceNum);

  return router;
};
