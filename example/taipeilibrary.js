const { launch } = require("../index");
const taipeilibraryConfig = {
  url:
    "http://book.tpml.edu.tw/webpac/bookSearchList.do?searchtype=simplesearch&execodeHidden=true&execode=&authoriz=1&search_field=TI&search_input=%E6%B8%AC%E8%A9%A6&resid=188957713&nowpage=1#searchtype=simplesearch&execodeHidden=true&execode=&authoriz=1&search_field=TI&search_input=%E6%B8%AC%E8%A9%A6&resid=188957713&nowpage=1",
  listItemContainer: ".tablesorter tr",
  expectedListItemNotLessThan: 10,
  waitForFrame: "leftFrame",
  item: {
    title: ["a", "textContent"]
  }
};

(async () => {
  let result = [];
  const crawler = await launch();
  await crawler.crawl(taipeilibraryConfig, ({ items, pagination }) => {
    result = result.concat(items);
    console.warn("currenat pagination", pagination);
  });
  await crawler.close();
  console.warn("final result", result.length, result);
})();
