const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')
// const express = require('express')
// const app = express()

const cnodeUrl = 'https://cnodejs.org/'

// app
//   .get('/', (req, response, next) => {
superagent.get(cnodeUrl).end((err, res) => {
  // if (err) {
  //   return next(err)
  // }
  const topicUrls = []
  const $ = cheerio.load(res.text)
  $('#topic_list .topic_title').each((idx, element) => {
    const $element = $(element)
    const href = url.resolve(cnodeUrl, $element.attr('href'))
    topicUrls.push(href)
  })
  topicUrls.splice(5, 40)
  // response.send(topicUrls)

  const ep = new eventproxy()

  ep.fail(err => console.log(err))

  ep.after('topic_html', topicUrls.length, topics => {
    topics = topics.map(function(topicPair) {
      const topicUrl = topicPair[0]
      const topicHtml = topicPair[1]
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
    })

    console.log('final:')
    console.log(topics)

    // response.send(topics)
  })

  let i = 1
  topicUrls.forEach(topicUrl => {
    superagent.get(topicUrl).end((err, res) => {
      // if (err) next(err)
      console.log(`${i++} - fetch ${topicUrl} successful`)
      ep.emit('topic_html', [topicUrl, res.text])
    })
  })
})
// })
// .listen(3000, () => {
//   console.log('app is listening at port 3000')
// })
