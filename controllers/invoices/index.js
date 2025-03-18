module.exports = (db) => ({
  getAllInvoices: require('./getAllInvoices')(db),
  getInvoiceById: require('./getInvoiceById')(db),
  getInvoiceByInvoiceNum: require('./getInvoiceByInvoiceNum')(db),
  createInvoice: require('./createInvoice')(db),
  updateInvoice: require('./updateInvoice')(db),
  updateInvoiceByInvoiceNum: require('./updateInvoiceByInvoiceNum')(db),
  deleteInvoice: require('./deleteInvoice')(db),
  deleteInvoiceByInvoiceNum: require('./deleteInvoiceByInvoiceNum')(db),
  getUnpaidInvoices: require('./getUnpaidInvoices')(db),
  convertCurrency: require('./convertCurrency')(db),
  convertCurrencyById: require('./convertCurrencyById')(db),
  convertCurrencyByInvoiceNum: require('./convertCurrencyByInvoiceNum')(db)
});