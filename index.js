#!/usr/bin/env node

'use strict'

const http = require('http')
const fs = require('fs')
const pad = require('pad-left')
const column = require('cli-columns')
const numeral = require('numeral')

console.log('Mengambil data terbaru...\n')

http.get('http://api.fixer.io/latest?base=IDR', res => {
    let body = ''

    res.on('data', chunk => {
        body += chunk
    })

    res.on('end', () => {
        let content = JSON.parse(body)
        let output = []

        for (let prop in content.rates) {
            let val = Math.round(1 / content.rates[prop])
            let formattedVal = numeral(val).format('0,0').replace(',', '.')

            output.push(`${pad(prop, 5, '')} : Rp ${pad(formattedVal, 6, '')}`)
        }

        console.log(`Nilai tukar per ${content.date}\n`)
        console.log(column(output, {
            padding: 10,
            newline: `\n${printLine()}\n`
        }))
        console.log(`
Catatan:
* tidak ada jaminan bahwa data di atas valid. Gunakan hanya sebagai referensi singkat.
* data diperbaharui setiap hari jam 15:00 CET.
        `)
    })
}).on('error', e => {
    console.log(`Gagal mengambil data`)
})

function printLine() {
    let line = ''

    for (var i = 0; i < process.stdout.columns; i++) {
        line += '-'
    }

    return line
}