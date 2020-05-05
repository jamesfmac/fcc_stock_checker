const priceLookup = require("../services/pricelookup");
const follows = require("../models/follows");

const { query, oneOf } = require("express-validator");

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
      //handle multiple stocks
      const stockDetails = await Promise.all(stock.map((x) => priceLookup(x)));

      if (follow) {
        await Promise.all(
          stockDetails.map((x) =>
            follows.create({
              ticker_symbol: x.symbol,
              ip: ip,
            })
          )
        );
        next;
      }

      const followsCount = await Promise.all(
        stockDetails.map((x) => follows.findCounts(x.symbol))
      );

      console.log(followsCount);

      const formattedStockDetails = stockDetails.map((x, i, arr) => {
        let denominatorStock = i == 0 ? 1 : 0;
        const follows = followsCount[i].follow_count || 0;
        const altFollows = followsCount[denominatorStock].follow_count || 0;

        return {
          ticker: x.symbol,
          price: x.latestPrice,
          rel_follows: follows / altFollows,
        };
      });

      return res.json(formattedStockDetails);
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
          stockData: {
            ticker: stockDetails.symbol,
            price: stockDetails.latestPrice,
            follows: parseInt(current_follows[0].follow_count),
          },
        });
      }
    }
    res.json("Stock not found");
  } catch (error) {
    next(error);
    console.log(error);
  }
};
