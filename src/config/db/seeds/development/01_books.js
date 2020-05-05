const follows = [
  { ticker_symbol: "AAPL", ip: "2600:8801:c301:7b00:fdea:8ad7:9a3a:30c" },
  { ticker_symbol: "AMZN", ip: "2600:8801:c301:7b00:fdea:8ad7:9a3a:30c" },
  { ticker_symbol: "NFLX", ip: "2600:8802:c301:7b00:fdea:8ad7:9a3a:30c" },
];

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex("follow")
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex("follow").insert(follows);
    });
};
