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
          [attorContent]: node ? node[attorContent] : undefined
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

class PuppeteerCrawler {
  constructor(
    browser,
    consoleHandler = msg => console.log("PuppeteerCrawler LOG:", msg.text())
  ) {
    this.browser = browser;
    this.consoleHandler = consoleHandler;
  }
  close() {
    return this.browser.close();
  }
  getBrowser() {
    return this.browser;
  }
  async crawl(config, onBatchDone) {
    const goTo = (url, name, pageNum) => {
      return this.page.goto(`${url}?${name}=${pageNum}`);
    };
    this.page = await this.browser.newPage();
    this.page.on("console", this.consoleHandler);
    let { pagination, url } = config;
    const { urlQuery } = pagination;
    await goTo(url, urlQuery.name, urlQuery.from);
    let finish = false;
    let currentPage = urlQuery.from;
    while (!finish) {
      const { status, result } = await this.page.evaluate(
        formatAccordingConfig,
        {
          config
        }
      );

      finish = status && currentPage + 1 > urlQuery.to;
      if (status) {
        await onBatchDone({
          items: result,
          pagination: { current: currentPage }
        });
      }
      if (finish) {
        break;
      }

      if (status) {
        await goTo(url, urlQuery.name, ++currentPage);
      }
    }
  }
}

async function launch(puppeteerOptions = { headless: true }) {
  const browser = await puppeteer.launch(puppeteerOptions);
  return new PuppeteerCrawler(browser);
}

module.exports = { launch };
