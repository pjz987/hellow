const fs = require('fs')
const http = require('http')

function readDb(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err) console.log(err)
        cb(err, JSON.parse(data.toString()))
        // return JSON.parse(data.toString())
    })
}

const server = http.createServer((req, res) => {
    // res.setEncoding('utf-8')
    if (req.method === 'POST') {
        req.on('data', (chunk) => console.log(chunk.toString()))
    }
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(404)
            res.end(JSON.stringify(err))
            return
        }
        readDb('db.json', (err, dbData) => {
            
            let messageList = ''
            dbData.messages.forEach((message) => {
                messageList += `<li>${message.username}: ${message.text} --${message.date}</li>`
            })
            const newData = data.toString().replace('qwertyrulezzz', messageList)
            console.log(messageList)
            console.log(newData)
            res.writeHead(200)
            res.end(newData.toString())

        })
    })
})

server.listen(8000)