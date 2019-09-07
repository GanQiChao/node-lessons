const express = require('express')
const utility = require('utility')
const app = express()

app.get('/', (req, res) => {
  // change query param to md5/sha1
  console.log(req.query)
  const { md5, sha1 } = req.query
  if (md5) {
    var md5Value = utility.md5(md5)

    res.send(`md5 = ${md5Value}`)
  } else if (sha1) {
    var sha1Value = utility.sha1(sha1)

    res.send(`sha1 = ${sha1Value}`)
  } else {
    res.send('not allow param, please use md5 or sha1.')
  }
})

app.listen(3000, (req, res) => {
  console.log('app is running at port 3000')
})
