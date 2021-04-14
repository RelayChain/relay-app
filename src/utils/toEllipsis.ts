const toEllipsis = (str: string, numCharsToHide: number = 7) =>
  str.substr(0, str.length / 2 - numCharsToHide) +
  '...' +
  str.substr(str.length / 2 + numCharsToHide, str.length)

export default toEllipsis
