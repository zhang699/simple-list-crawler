const { launch } = require("../index");
const mitJobConfig = {
  url: "https://meet.jobs/en/jobs?order=match",
  listItemContainer: ".job-card",
  expectedListItemNotLessThan: 10,
  item: {
    img: [".image-wrapper", "style"],
    title: [".job-title", "textContent"],
    salary: [".prices > .salary", "textContent"],
    location: [".location", "innerText"],
    employerName: [".employer-name", "textContent"],
    primarySkill: [".box-items > li:nth-child(2)", "textContent"],
    secondarySkill: [".box-items > li:nth-child(3)", "textContent"]
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
  await crawler.crawl(mitJobConfig, ({ items, pagination }) => {
    result = result.concat(items);
    console.warn("currenat pagination", pagination);
  });
  await crawler.close();
  console.warn("final result", result.length, result);
})();
