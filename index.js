const axios = require("axios");

let lastUpdate = null;

const getInformations = async () => {
  try {
    const response = await axios.post(
      "https://api.mir4global.com/wallet/prices/draco/lastest",
      {
        headers: {
          credentials: "omit",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://www.mir4draco.com/",
          method: "POST",
          mode: "cors",
        },
      },
      {}
    );

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const getUsdInBRL = async () => {
  try {
    const response = await axios.get(
      "http://economia.awesomeapi.com.br/json/last/USD-BRL"
    );

    const brl = Number(response.data.USDBRL.ask).toFixed(2);

    return brl;
  } catch (err) {
    console.error(err);
  }
};

const checkIsUpdated = async () => {
  const response = await getInformations();

  if (response.Code == 200) {
    const brl = await getUsdInBRL();
    const USDDracoRate = response.Data.USDDracoRate;

    if (!lastUpdate) {
      console.log(
        `[UPDATE] valor atual do draco USD: $${USDDracoRate} BRL: R$${
          brl * USDDracoRate
        }`
      );
      lastUpdate = response.Data;
    } else {
      if (USDDracoRate != lastUpdate.USDDracoRate) {
        const isIncreased =
          ((USDDracoRate - lastUpdate.USDDracoRate) / lastUpdate.USDDracoRate) *
            100 >=
          0
            ? `AUMENTOU ${
                ((USDDracoRate - lastUpdate.USDDracoRate) /
                  lastUpdate.USDDracoRate) *
                100
              }%`
            : `DIMINUIU ${
                ((USDDracoRate - lastUpdate.USDDracoRate) /
                  lastUpdate.USDDracoRate) *
                100
              }%`;

        console.log(isIncreased);
        console.log(
          `[UPDATE] novo valor USD: $${USDDracoRate} BRL: R$${
            brl * USDDracoRate
          }`
        );
        lastUpdate = response.Data;
      }
    }
  } else {
    console.error(response);
  }
};

setInterval(() => {
  console.log("[SCRIPT] checking updates...");
  checkIsUpdated();
}, 5000);
