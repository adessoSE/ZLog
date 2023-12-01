import jwt_decode from 'jwt-decode';

export const selectToken = (state) => state.auth.token;
export const selectIsSessionExpired = (state) => {
  if (true || process.env.REACT_APP_FAKE_LOGIN === 'true') {
    return false;
  } else {
    if (state.auth.token == null) {
      return true;
    }
    var decoded = selectTokenDecoded(state);
    return Date.now() / 1000 > decoded.exp; // true if expired
  }
};
//export const selectIsLoggedIn = (state) => true;
export const selectUserName = (state) => state.auth.token?.name;
export const selectUserMail = (state) => state.auth.token?.email;
export const selectTokenDecoded = (state) => jwt_decode(state.auth.token.token);
