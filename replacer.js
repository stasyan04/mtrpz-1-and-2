'use strict'

const openingTags = {
    ['(?<=^|\s)\*\*(?=\S)']: '<b>',
    ['(?<=^|\s)_(?=\S)']: '<i>',
    ['(?<=^|\s)`(?=\S)']: '<tt>',
}

const closingTags = {
   ['(?<=\S)\*\*(?=\s|$)']: '</b>',
   ['(?<=\S)_(?=\s|$)']: '</i>',
   ['(?<=\S)`(?=\s|$)']: '</tt>',
}

const allTags = [ ...Object.keys(openingTags), ...Object.keys(closingTags) ].join('|')

const preformatted = '(?<=^|\n)```(.*)```(?=\n|$)'
const preformattedTag = '<pre>$1</pre>'
const tempPrefReplace = '$temp$'
const preformattedPieces = []


const paragraph = '(\r\n|\r|\n){2,}'
const paragraphOpener = '<p>'
const paragraphCloser = '</p>'

export default (text) => {
    const newText = hidePreformatted(text)

    const withTags = findTags(newText)
    const paragraphed = splitParagraphs(withTags)

    return showPreformatted(paragraphed)
}

const hidePreformatted = (text) => {
    for (const piece of text.matchAll(preformatted)) {
        preformattedPieces.push(piece[0])
        text = text.replace(piece[0], tempPrefReplace)
    }

    return text
}

const showPreformatted = (text) => {
    for (const piece of preformattedPieces) {
        text = text.replace(tempPrefReplace, piece)
    }
    preformattedPieces = []

    return text
}

const splitParagraphs = (text) => {
    let closing = false

    while (text.includes(paragraph)) {
        text.replace(paragraph, closing ? paragraphCloser : paragraphOpener)
        closing = !closing
    }

    return text
}

const findTags = (text) => {
    const tags = text.matchAll(allTags)
    let expected;

    for (const tag of tags) {
        if (expected && tag[0] !== expected) {
            throw new Error(`Expected ${expected} but found ${tag[0]}`)
        }

        if (expected) {
            expected = null
            text = text.replace(tag[0], closingTags[tag[0]])
            continue
        }

        const tagIndex = Object.keys(openingTags).indexOf(tag[0])

        if (tagIndex === -1) {
            throw new Error(`Unexpected closing tag ${tag[0]}`)
        }

        expected = Object.keys(closingTags)[tagIndex]

        text = text.replace(tag[0], openingTags[tag[0]])
    }
}