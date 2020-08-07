const http = require('http')
const fs = require('fs')

function readDb(cb) {
    fs.readFile('db.json', (err, data) => {
        console.log('test')
        console.log(data.toString())
        if (err) console.log(err)
        cb(err, data)
        return JSON.parse(data.toString())
    })
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:8000/')
    if (url.pathname === '/messages') {

        readDb((err, data) => {
            if (err) res.write(404)
            const messages = JSON.parse(data).messages
            messages.forEach(message => {
                res.write(message.text+'\n')
            }) 
            res.end()
        })
    }
    else if (url.pathname === '/newmessage') {
        const text = url.searchParams.get('text')
        readDb((err, data) => {
            if (err) res.write(404)
            data = JSON.parse(data)
            const message = {
                text: text,
                id: data.messages.length
            }
            data.messages.push(message)
            data.messages.forEach(message => {
                res.write(message.text+'\n')
            })
            const outData = JSON.stringify(data)
            fs.writeFile('db.json', outData, (err) => {
                if (err) console.log(err)
            })
            res.end()
        })
        console.log(text)
    }
    console.log(req.method)
    console.log(url)
    // res.end(path)
})
server.listen(8000)
