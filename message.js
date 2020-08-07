const http = require('http')
const fs = require('fs')
const tape = require('tape')

function readDb(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err) console.log(err)
        cb(err, data)
        return JSON.parse(data.toString())
    })
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:8000/')
    // if (url.pathname === '/messages') {
    if (req.method === 'GET') {

        readDb('db.json', (err, data) => {
            if (err) res.write(404)
            const messages = JSON.parse(data).messages
            messages.forEach(message => {
                res.write(message.text+'\n')
            }) 
            res.end()
        })
    }
    // else if (url.pathname === '/newmessage') {
    else if (req.method === 'POST' && url.pathname === '/newmessage') {
        console.log(req.body)
        const text = url.searchParams.get('text')
        readDb('db.json', (err, data) => {
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

                // tape('db test', t => {
                //     let test = undefined
                //     let db = undefined
                //     readDb('example.json', (err, data) => {
                //         test = JSON.parse(data).messages
                //         readDb('db.json', (err, data) => {
                //             db = JSON.parse(data).messages
                //             t.plan(db.length)
                //             for (let i=0; i<db.length; i++) {
                //                 t.equal(db[i].text, test[i].text)
                //             }
                //         })
                //     })

                // })

            })
            res.end()
        })
    }
    console.log(req.method)
    console.log(url)
    // res.end(path)
})
server.listen(8000)
