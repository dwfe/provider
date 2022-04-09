export function ifArraysCheckEqual(a: any, b: any): boolean {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return arraysEqual(a, b);
  else if (aIsArr || bIsArr)
    return false;
  return true; // both values are not arrays
}

export function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length)
    return false;
  return a.every((ai, i) => Object.is(ai, b[i]));
}


