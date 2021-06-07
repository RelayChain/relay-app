/**
 * Returns true if the string value is relay in hex
 * @param hexNumberString
 */
export default function isRelay(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}
