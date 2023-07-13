export function hasImplemented(
  obj: any,
  ...attrs: string[]
) {
  for (const attr of attrs) {
    if ((attr in obj) === false)
      return false;
  }

  return true;
}
