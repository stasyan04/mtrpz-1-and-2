'use strict'

const openingTags = {
    ['(?<=^|\\s)\\*\\*(?=\\S)']: '<b>',
    ['(?<=^|\\s)_(?=\\S)']: '<i>',
    ['(?<=^|\\s)`(?=\\S)']: '<tt>',
}

const closingTags = {
   ['(?<=\\S)\\*\\*(?=\\s|$)']: '</b>',
   ['(?<=\\S)_(?=\\s|$)']: '</i>',
   ['(?<=\\S)`(?=\\s|$)']: '</tt>',
}

const allTags = { ...openingTags, ...closingTags }

const preformatted = /(?<=^|\n|\r|\r\n)```([\s\S]+?)```(?=\n|\r|\r\n|$)/g
const preformattedOpen = '<pre>'
const preformattedClose = '</pre>'
const tempPrefReplace = '$temp$'
const preformattedPieces = []


const paragraph = /(\r\n|\r|\n){2,}/g
const paragraphInHtml = '</p>\n<p>'

export default (text) => {
    const newText = hidePreformatted(text)

    const withTags = findTags(newText)
    const paragraphed = splitParagraphs(withTags)

    return showPreformatted(paragraphed)
}

const hidePreformatted = (text) => {
    for (const piece of text.matchAll(preformatted)) {
        preformattedPieces.push(piece[1])
        text = text.replace(piece[0], tempPrefReplace)
    }

    return text
}

const showPreformatted = (text) => {
    for (const piece of preformattedPieces) {
        text = text.replace(tempPrefReplace, preformattedOpen + piece + preformattedClose)
    }
    preformattedPieces.length = 0

    return text
}

const splitParagraphs = (text) => {
    text = '<p>' + text + '</p>'
    text = text.replaceAll(paragraph, paragraphInHtml)

    return text
}

const findTags = (text) => {
    const listTags = []
    for (const tag in allTags) {
        const matches = text.matchAll(new RegExp(tag, 'g'))
        
        for (const match of matches) {
            listTags.push([match.index, tag])
        }
    }
    listTags.sort((a, b) => a[0] - b[0])

    let expected = null

    for (const tag of listTags) {
        if (expected && tag[1] !== expected) {
            throw new Error(`Expected ${expected} but found ${tag[1]}`)
        }

        if (expected) {
            expected = null
            text = text.replace(new RegExp(tag[1]), closingTags[tag[1]])
            continue
        }

        const expectedIndex = Object.keys(openingTags).indexOf(tag[1])

        if (expectedIndex === -1) {
            throw new Error(`Unexpected closing tag ${tag[1]}`)
        }

        expected = Object.keys(closingTags)[expectedIndex]

        text = text.replace(new RegExp(tag[1]), openingTags[tag[1]])
    }

    return text
}