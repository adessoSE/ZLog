export function getListOfTruthyProps(obj = {}) {
  return Object.keys(obj).filter((key) => obj[key]);
}
