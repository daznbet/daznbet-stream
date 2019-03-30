const express = require('express')
const cors = require('cors')
const sseExpress = require('sse-express')
const { Consumer } = require('sqs-consumer')
const EventEmitter = require('events')

const app = express()
const port = 4000

app.use(cors())

const queueEvent = new EventEmitter()

const consumer = Consumer.create({
  queueUrl: `https://sqs.sa-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${process.env.QUEUE_NAME}`,
  handleMessage: async (message) => {
    queueEvent.emit('message', message)
  }
})

app.get('/events', sseExpress, (req, res) => {
  queueEvent.on('message', () => {
    res.sse('event', message)
  })
})

consumer.start()

app.listen(port, () => console.log(`dazn-stream listening on port ${port}!`))
