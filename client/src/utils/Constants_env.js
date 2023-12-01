const prod = {
  API_LOGS: '/data/logging',
  API_LOGS_SCHEMA: '/data/logging/fields',
  API_SETTINGS: '/data/usersettings',
  API_COMMENTS: '/data/logcomments',
  API_OAUTH_LOGOUT: '/auth/logout',

};

const local = {
  API_LOGS: 'http://localhost:8090/data/logging',
  API_LOGS_SCHEMA: 'http://localhost:8090/data/logging/fields',
  API_SETTINGS: 'http://localhost:8090/data/usersettings',
  API_COMMENTS: 'http://localhost:8090/data/logcomments',
  API_OAUTH_LOGOUT: 'http://localhost:8090/auth/logout',

};


const dev = {
  API_LOGS: 'http://ccb2ffm3-zlog-dev01.test-server.ag:8090/data/logging',
  API_LOGS_SCHEMA: 'http://ccb2ffm3-zlog-dev01.test-server.ag:8090/data/logging/fields',
  API_SETTINGS: 'http://ccb2ffm3-zlog-dev01.test-server.ag:8090/data/usersettings',
  API_COMMENTS: 'http://ccb2ffm3-zlog-dev01.test-server.ag:8090/data/logcomments',
  API_OAUTH_LOGOUT: 'http://localhost:8090/auth/logout',

};

let config;
switch (process.env.REACT_APP_ENVIRONMENT) {
  case 'production':
    config = prod;
    break;
  case 'local':
    config = local;
    break;
  case 'dev':
    config = dev;
    break;
  default:
    config = local;
}

let securityConf;
switch (process.env.REACT_APP_OAUTH_LOGIN) {
  case 'true':
    securityConf = true;
    break;
  case 'false':
    securityConf = false;
    break;
  default:
    securityConf = true;
}
export const config_env = config;
export const security_env = securityConf;
