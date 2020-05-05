const { Router } = require("express");




module.exports = () => {
  let api = Router();
  api.route("/").get(async (req, res) => {
    const books = await book.findAll();
    res.render("index", { books: books });
  });
  api.route("/book/:id").get(async (req, res) => {
    const id = req.params.id;
    const details = await book.findOne(id);
    res.render("book", { details });
  });

  return api;
};
