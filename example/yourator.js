const { launchPuppeteerCrawler } = require("../index");
const youratorConfig = {
  url: "https://www.yourator.co/companies",
  listItemContainer: "#y-company-list-cards > .container > .row .y-card",
  expectedListItemNotLessThan: 10,
  item: {
    img: [".y-card-img > a > img", "src"],
    title: [".y-card-content-title > a", "href", "text"],
    descrption: [".y-card-content-description", "textContent"]
  },
  pagination: {
    urlQuery: {
      from: 1,
      to: 3,
      name: "page"
    }
  },
  onBatchWrite: items => items
};

(async () => {
  await launchPuppeteerCrawler(youratorConfig);
})();