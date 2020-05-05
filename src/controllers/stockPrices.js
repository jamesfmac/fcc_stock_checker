const priceLookup = require("../services/pricelookup");
const follows = require("../models/follows");

const { body, param, query, oneOf } = require("express-validator");

exports.validationRules = () => {
  return [
    query("stock").exists().withMessage("Required field"),
    oneOf([
      query("stock")
        .isArray()
        .custom((x) => x.length == 2)
        .withMessage("Must be a single or pair of NASDAQ ticker symbols"),
      query("stock")
        .isString()
        .notEmpty()
        .withMessage("Must be a single or pair of NASDAQ ticker symbols"),
    ]),
    query("follow")
      .optional()
      .isBoolean()
      .custom((x) => {
        return Array.isArray(x) == false;
      })
      .withMessage("Must be a boolean"),
  ];
};

exports.getQuote = async (req, res, next) => {
  try {
    const { stock, follow } = req.query;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const isPair = Array.isArray(stock);
    if (isPair) {

      //handle multiple codes 



    } else {
      const stockDetails = await priceLookup(stock);
      if (stockDetails.hasOwnProperty("symbol")) {
        if (follow) {
          const result = await follows.create({
            ticker_symbol: stockDetails.symbol,
            ip: ip,
          });
          next;
        }

        const current_follows = await follows.findCounts(stockDetails.symbol);
        return res.json({
          ticker: stockDetails.symbol,
          price: stockDetails.latestPrice,
          follows: parseInt(current_follows[0].follow_count),
        });
      }
    }
    res.json("Stock not found");
  } catch (error) {
    next(error);
    console.log(error);
  }
};
