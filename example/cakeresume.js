const { launch } = require("../index");
const config = {
  url: "https://www.cakeresume.com/jobs?",
  listItemContainer: ".well-list-item",
  expectedListItemNotLessThan: 10,
  item: {
    company: [".job-link", "textContent"],
    img: [".company-logo.img-responsive", "src"],
    title: [".job-title", "textContent"],
    salary: [".job-salary-section", "textContent"],
    description: [".job-desc"]
  },
  pagination: {
    urlQuery: {
      from: 1,
      to: 3,
      name: "page"
    }
  }
};

(async () => {
  let result = [];
  const crawler = await launch();
  await crawler.crawl(config, ({ items, pagination }) => {
    result = result.concat(items);
    console.warn("currenat pagination", pagination);
  });
  await crawler.close();
  console.warn("final result", result.length, result);
})();
