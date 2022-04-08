export const hex2Dec = (hex) => {

    return parseInt(hex, 16)
}

export const dec2Hex = (dec) => {
    if (dec) {
        return dec.toString(16)
    }
    return null
}