const { Router } = require("express");

module.exports = () => {
  let router = Router();
  router.route("/").get(async (req, res) => {
    res.render("index");
  });
  return router;
};
