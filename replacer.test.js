import convert from "./replacer.js"

test('valid HTML', () => {
    const md = '_italic_ and **bold**'
    expect(convert(md, 'html')).toBe('<p><i>italic</i> and <b>bold</b></p>')
})

test('valid escape', () => {
    const md = '_italic_ and **bold**'
    expect(convert(md, 'escape')).toBe('\x1b[3mitalic\x1b[0m and \x1b[1mbold\x1b[0m')
})

test('unmatched opening tag', () => {
    const md = '`unmatched'
    expect(() => convert(md, 'html')).toThrow()
})

test('nested tag', () => {
    const md = '_tag **inside** tag_'
    expect(() => convert(md, 'escape')).toThrow()
})

test('faulty test', () => {
    const md = 'some text'
    expect(() => convert(md, 'html')).toBe('other text')
})