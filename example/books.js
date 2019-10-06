const { launch } = require("../index");
const config = {
  url:
    "https://search.books.com.tw/search/query/key/%E9%87%8D%E6%A7%8B/cat/all",
  listItemContainer: "#searchlist .item",
  item: {
    title: ["a", "title"],
    author: ["a[rel='go_author']", "textContent"],
    price: [".price strong:nth-child(2) b", "textContent"]
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
