const { launch } = require("../index");
const config = {
  url: "https://news.ycombinator.com/",
  listItemContainer: ".athing",
  expectedListItemNotLessThan: 10,
  delay: 100,
  item: {
    author: [".hnuser", "innerText"],
    title: [".storylink", "textContent", "href"],
    score: [".score", "innerText"],
    comments: [".comments", "innerText"]
  },
  pagination: {
    urlQuery: {
      from: 1,
      to: 3,
      name: "p"
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
