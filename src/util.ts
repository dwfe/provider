/**
 * If in the calling code a or b are optional
 */
export function arraysEqualFailCheck(a: any, b: any): boolean {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return arraysEqual(a, b);
  else if (aIsArr || bIsArr)
    return false;
  return true; // both values are not arrays -> don't interfere with possible subsequent checks
}

/**
 * If in the calling code a and b are required
 */
export function arraysEqualStrictCheck(a: any, b: any): boolean {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return arraysEqual(a, b);
  return false;
}

export function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length)
    return false;
  return a.every((ai, i) => Object.is(ai, b[i]));
}

export const isFunction = (value: any): boolean =>
  typeof value === 'function'
;
