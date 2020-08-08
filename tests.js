const tape = require('tape')
const http = require('http')

tape('get request', t => {
    http.get('http://localhost:8000/', res => {
        res.setEncoding('utf-8')
        let html = ''
        res.on('data', (chunk) => {
            html += chunk
        })
        res.on('end', () => {
            const hellow = html.includes('hellow')
            t.plan(1)
            t.equal(hellow, true)
        })
        // console.log(res.body)
        // console.log(hellow)
    })
})