const http = require('http')
const fs = require('fs')
const { parse } = require('querystring')
const tape = require('tape')

function readDb(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err) console.log(err)
        cb(err, JSON.parse(data.toString()))
    })
}

function error404(err, res) {
    fs.readFile('404.html', (err, data) => {
        if (err) console.log(err)
        res.writeHead(404)
        res.end(data)
    })
}

function renderMessages(res, path) {
    fs.readFile(path, (err, data) => {
        if (err) {
            error404(err, res)
            return
        }
        readDb('db.json', (err, dbData) => {

            let messageList = ''
            dbData.messages.forEach((message) => {
                const date = new Date(message.date)
                messageList += `<li>${message.username}: ${message.text} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</li>`
            })
            const newData = data.toString().replace('qwertyrulezzz', messageList)
            res.writeHead(200)
            res.end(newData.toString())
        })
    })
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:8000/')
    if (url.pathname !== '/') {
        error404(404, res)
    }
    if (req.method === 'GET') {
        renderMessages(res, 'index.html')
    }
    else if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => body += chunk.toString())

        req.on('end', () => {
            console.log(parse(body))
            const text = parse(body).text
            const username = parse(body).username
            readDb('db.json', (err, data) => {
                if (err) res.write(404)
                data = data
                const message = {
                    text: text,
                    date: new Date().toString(),
                    username: username
                }
                data.messages.push(message)
                const outData = JSON.stringify(data)

                fs.writeFile('db.json', outData, (err) => {
                    if (err) console.log(err)
                    renderMessages(res, 'index.html')
                })
            })
        })
    }
    console.log(req.method)
    console.log(url)
})
server.listen(8000)

function doTest() {
    tape('db test', t => {
        let test = undefined
        let db = undefined
        readDb('example.json', (err, data) => {
            test = JSON.parse(data).messages
            readDb('db.json', (err, data) => {
                db = JSON.parse(data).messages
                t.plan(db.length)
                for (let i = 0; i < db.length; i++) {
                    t.equal(db[i].text, test[i].text)
                }
            })
        })
    })
}