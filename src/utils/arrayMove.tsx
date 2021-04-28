export function arrayMove(arr: Array<{}>, fromIndex: number, toIndex: number) {
    var element = arr[fromIndex]
    arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, element)
    return arr
  }