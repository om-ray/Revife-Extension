const functions = require("firebase-functions");
const puppeteer = require("puppeteer");

async function scrapeProductData(page, link) {
  await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
  await page.waitForSelector("table, div", { timeout: 1000 });

  const productData = await page.evaluate(() => {
    const getTextContent = (label) => {
      const tables = document.querySelectorAll("table");
      const divs = document.querySelectorAll("div");

      const findLabelAndGetValue = (row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        for (let i = 0; i < cells.length - 1; i++) {
          const paragraph = cells[i].querySelector("p");
          if (paragraph && paragraph.textContent.includes(label)) {
            const nextCellParagraph = cells[i + 1].querySelector("p");
            return nextCellParagraph
              ? nextCellParagraph.textContent.trim()
              : null;
          }
        }
        return null;
      };

      for (const table of tables) {
        const rows = table.querySelectorAll("tr");
        for (const row of rows) {
          const value = findLabelAndGetValue(row);
          if (value) return value;
        }
      }

      for (const div of divs) {
        const firstChild = div.firstElementChild;
        if (
          firstChild?.tagName === "H3" &&
          firstChild.getAttribute("design") === "h7"
        ) {
          const paragraphs = div.querySelectorAll("p");
          for (const paragraph of paragraphs) {
            if (paragraph.textContent.includes(label)) {
              const nextParagraph = paragraph.nextElementSibling;
              return nextParagraph ? nextParagraph.textContent.trim() : null;
            }
          }
        }
      }

      return null;
    };

    const id = window.location.pathname.split("/").pop() || "";
    const brand = getTextContent("Brand");
    const condition = "New";
    const type = getTextContent("Type");
    const gender = getTextContent("Women/Men/Kids");
    const size = getTextContent("Size");
    const garmentLength = getTextContent("Garment length");
    const waist = getTextContent("Waist (cm)");
    const color = getTextContent("Color");
    const material = getTextContent("Material");
    const pattern = getTextContent("Pattern");
    const fabric = getTextContent("Fabric");
    const price =
      document.querySelector('p[design="h4"]')?.textContent?.trim() ?? null;
    const pictures = Array.from(
      document.querySelectorAll("ul#carousel img")
    ).map((img) => img.src);

    return {
      id,
      brand,
      condition,
      type,
      gender,
      size,
      garmentLength,
      waist,
      color,
      material,
      pattern,
      fabric,
      price,
      pictures,
    };
  });

  return productData;
}

exports.scrapeProductsFromSets = functions.https.onCall(
  async (data, context) => {
    try {
      const { sets } = data;
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      const scrapedSets = {};

      for (const [setName, setData] of Object.entries(sets)) {
        const scrapedProducts = [];
        for (const productLink of setData.productLinks) {
          try {
            const productData = await scrapeProductData(page, productLink);
            scrapedProducts.push(productData);
          } catch (error) {
            console.error(`Error scraping product ${productLink}:`, error);
          }
        }

        scrapedSets[setName] = {
          ...setData,
          products: scrapedProducts,
        };
      }

      console.log("Scraped sets:", scrapedSets);

      await browser.close();
      return { success: true, scrapedSets };
    } catch (error) {
      console.error("Error in scrapeProductsFromSets:", error);
      return { success: false, error: error.message };
    }
  }
);
