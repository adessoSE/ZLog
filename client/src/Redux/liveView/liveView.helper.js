import Constants from '../../utils/Constants';

export function getFactorForUnit(unit) {
  let factor = 0;
  switch (unit) {
    case Constants.MS:
      factor = 1;
      break;
    case Constants.SEC:
      factor = 1000;
      break;
    case Constants.MIN:
      factor = 60000;
      break;
    default:
      break;
  }
  return factor;
}
