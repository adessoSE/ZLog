import { createMuiTheme } from '@material-ui/core/styles';
import Constants from '../../utils/Constants';

/**
 * Die Farbpalette zur Dunkelgrauen Farbe von der Startseite:
 * #e7e9ea
 * #3c4149
 * #6ba5e5
 * #87888a
 * #3e7ed0
 * #acacac
 * #5d6062
 * #54657c
 * #6b747c
 * #060606
 */
const DateTimePickerTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.primaryColor,
    },
  },
  typography: {
    fontSize: 12.5,
  },
});

export default DateTimePickerTheme;
