const { Router } = require("express");
const { validate } = require("../utils/validator");
const stockPricesController = require("../controllers/stockPrices")

module.exports = () => {
  let api = Router();

  api.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/src/views/api.html");
  });

  api.route("/stock-prices")
  .get(stockPricesController.validationRules(), validate, stockPricesController.getQuote)



  

  return api;
};
