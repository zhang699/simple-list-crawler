const puppeteer = require("puppeteer");

const formatAccordingConfig = ({ config }) => {
  const { item, expectedListItemNotLessThan, listItemContainer } = config;

  const listItems = [...document.querySelectorAll(`${listItemContainer}`)];
  if (listItems.length <= expectedListItemNotLessThan) {
    return { status: false };
  }
  const formattedItems = listItems.map(function(listItem) {
    return Object.keys(item).reduce((pre, itemConfigKey) => {
      const [itemSelector, ...attrOrContentValues] = item[itemConfigKey];
      const node = listItem.querySelector(itemSelector);

      const nodeResult = attrOrContentValues.reduce(
        (pre, attorContent) => ({
          ...pre,
          [attorContent]: node[attorContent]
        }),
        {}
      );
      return {
        ...pre,
        [itemConfigKey]: nodeResult
      };
    }, {});
  });
  return { status: true, result: formattedItems };
};

async function launchPuppeteerCrawler(config) {
  function goTo(url, name, pageNum) {
    return page.goto(`${url}?${name}=${pageNum}`);
  }
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", consoleObj => console.log(consoleObj.text()));
  let { pagination, url } = config;
  const { urlQuery } = pagination;
  await goTo(url, urlQuery.name, urlQuery.from);
  let finish = false;
  let final = [];
  let currentPage = urlQuery.from;
  while (!finish) {
    const { status, result } = await page.evaluate(formatAccordingConfig, {
      config
    });
    ++currentPage;
    finish = status && currentPage > urlQuery.to;
    if (status) {
      final = final.concat(result);
      await config.onBatchWrite(result);
    }
    if (finish) {
      break;
    }

    await goTo(url, urlQuery.name, currentPage);
  }
  return final;
}

module.exports = {
  launchPuppeteerCrawler
};
