## Usage

Run the script using Node.js:

   ```bash
   node app.js
   ```

## How it Works

1. **Launching the Browser**: The script starts by launching a headless Chromium browser using Puppeteer.

2. **Navigating to the Product Page**: It then navigates to the specified product page URL.

3. **Extracting Data**: Once the page is loaded, the script extracts product information using CSS selectors. It targets the list items containing product details.

4. **Parsing Product Attributes**: For each product element, it extracts attributes like shop name and price by parsing the `data-dl-click` attribute.

5. **Exporting Data**: The extracted product data is stored in a JavaScript object. Finally, the script exports this data to a file named `products.txt`.

6. **Error Handling**: The script includes error handling to catch and log any errors that occur during the scraping process.
