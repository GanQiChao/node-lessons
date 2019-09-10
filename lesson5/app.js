var async = require('async')
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')

const cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl).end((err, res) => {
  const topicUrls = []
  const $ = cheerio.load(res.text)
  $('#topic_list .topic_title').each((idx, element) => {
    const $element = $(element)
    const href = url.resolve(cnodeUrl, $element.attr('href'))
    topicUrls.push(href)
  })

  const convert = function(url, html) {
    const topicUrl = url
    const topicHtml = html
    const $ = cheerio.load(topicHtml)
    const reply = $('.reply_item').eq(0)
    return {
      title: $('.topic_full_title')
        .text()
        .trim(),
      href: topicUrl,
      comment1: reply
        .find('.reply_content')
        .text()
        .trim(),
      author: reply.find('.author_content img').attr('title'),
      score: reply
        .find('.user_action .up-count')
        .text()
        .trim()
    }
  }

  var concurrencyCount = 0
  const fetchUrl = function(url, callback) {
    superagent.get(url).end((err, res) => {
      // if (err) next(err)
      console.log(`fetch ${url} successful`)
      concurrencyCount--
      const data = convert(url, res.text)
      callback(null, data)
    })
    concurrencyCount++
    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url)
  }

  async.mapLimit(
    topicUrls,
    5,
    function(url, callback) {
      fetchUrl(url, callback)
    },
    function(err, result) {
      console.log('final:')
      console.log(result)
    }
  )
})

/* var concurrencyCount = 0
var fetchUrl = function(url, callback) {
  var delay = parseInt((Math.random() * 10000000) % 2000, 10)
  concurrencyCount++
  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒')
  setTimeout(function() {
    concurrencyCount--
    callback(null, url + ' html content')
  }, delay)
}

var urls = []
for (var i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i)
}

async.mapLimit(
  urls,
  5,
  function(url, callback) {
    fetchUrl(url, callback)
  },
  function(err, result) {
    console.log('final:')
    console.log(result)
  }
) */
