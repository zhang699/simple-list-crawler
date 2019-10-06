const puppeteer = require("puppeteer");

function waitForFrame(page, name) {
  let fulfill;
  const promise = new Promise(x => (fulfill = x));
  checkFrame();
  return promise;

  function checkFrame() {
    const frame = page.frames().find(f => f.name() === name);
    if (frame) fulfill(frame);
    else page.once("frameattached", checkFrame);
  }
}
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
    const goTo = (url, name, pageNum, pageHandle = this.page) => {
      if (name) {
        return pageHandle.goto(`${url}?${name}=${pageNum}`);
      }
      return pageHandle.goto(`${url}`);
    };
    this.page = await this.browser.newPage();
    this.page.on("console", this.consoleHandler);
    let currentPageHandle = this.page;
    let { pagination = {}, url } = config;
    const { urlQuery = { name: "" } } = pagination;
    await goTo(url, urlQuery.name, urlQuery.from);
    let finish = false;
    let currentPage = urlQuery.from;

    while (!finish) {
      if (config.waitFor) {
        await this.page.waitForSelector(config.waitFor);
      } else if (config.delay) {
        await this.page.waitFor(config.delay || 1);
      } else if (config.waitForFrame) {
        const frame = await waitForFrame(this.page, config.waitForFrame);
        currentPageHandle = frame;
      }
      const { status, result } = await currentPageHandle.evaluate(
        formatAccordingConfig,
        {
          config
        }
      );

      finish = !urlQuery.name || (status && currentPage + 1 > urlQuery.to);
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
