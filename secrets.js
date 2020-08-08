function readDb(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err) console.log(err)
        cb(err, data)
        return JSON.parse(data.toString())
    })
}
let messages
readDb('db.json', (err, data) => {
    if (err) console.log(err)
    messages = data.messages
})