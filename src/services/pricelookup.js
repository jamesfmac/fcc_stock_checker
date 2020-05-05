const fetch = require("node-fetch");

module.exports = async (ticker) => {
  const timeoutPromise = (ms, promise) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("promise timeout"));
      }, ms);
      promise.then(
        (res) => {
          clearTimeout(timeoutId);
          resolve(res);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    });
  };
  const stockAPI = "https://repeated-alpaca.glitch.me/v1/stock/";
  try {
    const response = await timeoutPromise(
      1000,
      fetch(`${stockAPI}${ticker}/quote`, {
        method: "get",
      })
    );

    if (response.status == 200) {
      return await response.json();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
