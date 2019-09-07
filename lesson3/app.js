const express = require('express')
// 分析网页：Node.js 下的 jQuery
const cheerio = require('cheerio')
// 抓取网页：http 库，用于发起 get 或 post
const superagent = require('superagent')

const app = express()

app.get('/', (req, res, next) => {
  // 抓取网页数据
  superagent.get('https://cnodejs.org/').end(function(err, sres) {
    if (err) {
      return next(err)
    }
    // sres.text 是抓取页面的返回内容 html
    // $ 命名，因类似 jQuery 功能
    const $ = cheerio.load(sres.text)
    const items = []
    $('#topic_list .cell').each(function(idx, element) {
      const $author = $(element).find('img')
      const $title = $(element).find('.topic_title')
      items.push({
        author: $author.attr('title'),
        title: $title.attr('title'),
        href: $title.attr('href')
      })
    })

    res.send(items)
  })
})

app.listen(3000, function() {
  console.log('app is listening at port 3000')
})
