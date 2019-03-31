const express = require('express')
const cors = require('cors')
const sseExpress = require('sse-express')
const { Consumer } = require('sqs-consumer')
const EventEmitter = require('events')

const app = express()
const port = process.env.HTTP_PORT

app.use(cors())

const queueEvent = new EventEmitter()

const consumer = Consumer.create({
  queueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${process.env.QUEUE_NAME}`,
  handleMessage: async (message) => {
    queueEvent.emit('message', message)
  }
})

app.get('/events', sseExpress, (req, res) => {
  queueEvent.on('message', (evt) => {
    res.sse(evt.Body.message, evt.Body)
  })
})

consumer.start()

app.listen(port, () => console.log(`daznbet-stream listening on port ${port}!`))
