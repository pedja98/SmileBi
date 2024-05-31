const puppeteer = require("puppeteer");
const fs = require("fs");

let browser;

(async () => {
  try {
    console.log("Launch the browser and open a new blank page");
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log("Navigating to the product page");
    const foundPage = await page.goto(
      "https://www.idealo.de/preisvergleich/OffersOfProduct/201846460_-aspirin-plus-c-forte-800-mg-480-mg-brausetabletten-bayer.html"
    );

    if (!foundPage) {
      throw new Error("Could not go to page");
    }

    console.log("Extracting data");

    const productSelector = "li.productOffers-listItem";
    const productElements = await page.$$(productSelector);

    if (!productElements || !productElements.length) {
      throw new Error("No product elements found on the page.");
    }

    const products = {};

    for (let index = 0; index < productElements.length; index++) {
      const productElement = productElements[index];
      const productElementAttributes = {};
      const productElementAttributesNames = await page.evaluate(
        element => Array.from(element.attributes).map(attr => attr.name),
        productElement
      );

      for (const productElementAttributesName of productElementAttributesNames) {
        if (productElementAttributesName === "data-dl-click") {
          const attributeValue = await page.evaluate(
            element => element.getAttribute("data-dl-click"),
            productElement
          );

          productElementAttributes["position"] = index + 1;
          const parsedValue = JSON.parse(attributeValue);
          if (!parsedValue["shop_name"]) {
            throw new Error(
              `Shop name missing for product at position ${productElementAttributes["position"]}`
            );
          }
          if (!parsedValue["products"][0]["price"]) {
            throw new Error(
              `Price missing for product at position ${productElementAttributes["position"]}`
            );
          }
          productElementAttributes["shop_name"] = parsedValue["shop_name"];
          productElementAttributes["price"] =
            parsedValue["products"][0]["price"];
          break;
        }
      }
      products[productElementAttributes["position"]] = productElementAttributes;
    }

    if (!Object.keys(products).length) {
      throw new Error("No product found on page");
    }

    console.log("Attempt to export data to products.txt");
    fs.writeFileSync("products.txt", JSON.stringify(products, null, 2));
    console.log("Products exported to products.txt file");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
