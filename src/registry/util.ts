export function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length)
    return false;
  return a.every((ai, i) => Object.is(ai, b[i]));
}


