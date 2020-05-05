const knex = require("../config/db/knex");

exports.create = async (data) => {
  try {
    const existing = await knex("follow")
      .select()
      .where({ ticker_symbol: data.ticker_symbol, ip: data.ip });
    if (existing[0]) {
      return;
    }
    const result = await knex("follow").insert(data);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findCounts = async (ticker_symbol) => {
  try {
    const result = await knex
      .select("ticker_symbol")
      .count("ip as follow_count")
      .from("follow")
      .where("ticker_symbol", ticker_symbol)
      .groupBy("ticker_symbol");

    return result;
  } catch (error) {
    throw error;
  }
};
