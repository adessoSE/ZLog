export default class Constants {
  static primaryColor = '#3888c9'; // needs to be also changed in SCSS/_variables
  static secondaryColor = '#93BEE1';
  static customLogoSource = ""; // if local image use require('...'), if not local image pass url as string, default: zlog logo
  static auth = '/auth';
  static solrTriggerEvents = '/triggers';
  static KEYS_TO_STORE = [
    'searchText',
    'filterSelected',
    'activeNavigators',
    'activeFields',
    'markedOnly',
    'choosedApplication',
    'sortUp',
  ];
  static KEY_MARKED_ROWS = 'marked_rows';
  static KEY_STATE = 'state';
  static COMMENT_INVALIDATION_FREQUENCY_SEC = 30;
  static SCROLLING_OFFSET_MILLIS = 2;

  static VALUE_FREQ_MIN_MS = 30000;
  static VALUE_FREQ_DEFAULT_UNIT = 'sec';
  static MIN = 'min';
  static SEC = 'sec';
  static MS = 'ms';

  static VIEWS_PER_PAGE = 7;

  static C1 = null;
  static C2 = 12;
  static C3 = 31;
}
