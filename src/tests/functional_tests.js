const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../index");

const follows = require("../models/follows");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("GET /api/stock-prices => stockData object", () => {
    suiteSetup("Clean DB", () => {
      follows.destroyAll();
    });

    test("1 stock", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body.stockData, ["ticker", "price", "follows"]);
          assert.isString(res.body.stockData.ticker);
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.follows);

          done();
        });
    });

    test("1 stock with follow", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", follow: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body.stockData, ["ticker", "price", "follows"]);
          assert.isString(res.body.stockData.ticker);
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.follows);
          assert.equal(res.body.stockData.follows, 1);

          done();
        });
    });

    test("1 stock with follow again", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", follow: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body.stockData, ["ticker", "price", "follows"]);
          assert.isString(res.body.stockData.ticker);
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.follows);
          assert.equal(res.body.stockData.follows, 1);

          done();
        });
    });

    test("2 stocks", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices?stock=msft&stock=amzn")

        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body.stockData[0], [
            "ticker",
            "price",
            "rel_follows",
          ]);
          assert.hasAllKeys(res.body.stockData[1], [
            "ticker",
            "price",
            "rel_follows",
          ]);

          done();
        });
    });

    test("2 stocks with follow", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices?stock=msft&stock=amzn&follow=true")

        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.hasAllKeys(res.body.stockData[0], [
            "ticker",
            "price",
            "rel_follows",
          ]);
          assert.hasAllKeys(res.body.stockData[1], [
            "ticker",
            "price",
            "rel_follows",
          ]);
          assert.equal(res.body.stockData[0].rel_follows, 1);

          done();
        });
    });

    test("Invalid stock", (done) => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "xyz" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, "Stock not found");
          done();
        });
    });
  });
});
