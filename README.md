# Simple List Crawler

Crawl list in website using headless Puppeteer with an easy configuration.

### Examples

see [examples](https://github.com/zhang699/simple-list-crawler/tree/master/example)

example contain following sites:

- [books](https://www.books.com.tw/)
- [mitjobs](https://meet.jobs/zh-TW)
- [cakeresume](https://www.cakeresume.com/)


### Prepare the config according to your website

```js
{
  "url": "http://test", // site start to crawl
  "listItemContainer": "li" //the list item selector that content allocated in
  "item": {
    name: ['.name', 'textContent'],
    nickname: ['.nickname', 'text'],
    picture: ['.avatar', 'src'],
  },
  "pagination": {
    "urlQuery":{
      "from": 1,
      "to": 3
    }
  }
}
```

```HTML
<body>
  <li>
    <h4 class="name">Jimmy</h4>
    <img class="avatar" src="http://jimmy-123.jpg"/>
    <h6 class="nickname">JJ</h4>
  </li>
  <li>
    <h4 class="name">Jean</h4>
    <img class="avatar" src="http://jean.jpg"/>
    <h6 class="nickname">JN</h4>
  </li>
  <li>
    <h4 class="name">Yang</h4>
    <img class="avatar" src="http://yang.jpg"/>
    <h6 class="nickname">YY</h4>
  </li>
</body>

```

returned format is

```json
[
  {
    "name": { "textContent": "Jimmy" },
    "picture": { "src": "http://jimmy-123.jpg" },
    "nickname": { "textContent": "JJ" }
  },
  {
    "name": { "textContent": "Jean" },
    "picture": { "src": "http://jean.jpg" },
    "nickname": { "textContent": "JN" }
  },
  {
    "name": { "textContent": "Yang" },
    "picture": { "src": "http://yang.jpg" },
    "nickname": { "textContent": "YY" }
  }
]
```

- the first value in the value's array is [selector](https://developer.mozilla.org/docs/Web/API/Document/querySelector) tell Puppeteer which field want to select. you can use browser's `inspector`to find out the selector. the key of item object will identical in the result item.

- the second one is DOMNode's property such as `textContent`, `alt` ... (if imageMode), reference to [HTMLHtmlElement Documentation](https://developer.mozilla.org/docs/Web/API/HTMLHtmlElement) for more detail

- Provide pagination config for go through all list items, the format is `<url>?[name]=[from]`

  e.g. following config will go through the page from 1 to 3 of hackernews and visit the website three times.

  - https://news.ycombinator.com/news#?p=1
  - https://news.ycombinator.com/news#?p=2
  - https://news.ycombinator.com/news#?p=3

```
{
  "url": 'https://news.ycombinator.com/news#',
  "pagination": {
    "urlQuery": {
      "name": "p",
      "from": 1,
      "to": 3
    }
  }
}
```

### TODO

- [ ] 'manualy click' and 'loadMore' pagination
- [ ] callback for custimize/format each list item's format e.g trim() or split()
- [ ] click listitem's detail
