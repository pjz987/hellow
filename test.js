const tape = require('tape')
const fs = require('fs')

tape('tape-test', t => {
    t.plan(2)
    t.equal(1 + 1, 2)
    t.equal(2 + 2, 5)
})