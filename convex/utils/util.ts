import { isNil, omitBy } from "lodash";


let secrets: {
    client_id: string | null,
    client_secret: string | null
} = {
  client_id: null,
  client_secret: null
};
let token: {
    access: string | null,
    refresh: string | null
} = {
  access: null,
  refresh: null
};
let state = {
  isLoggedIn: false
};

/**
 * Get application access token
 * 
 * @return {string}
 */
export function getAccessToken(): string | null {
  return token.access;
}

/**
 * Get application refresh token
 * 
 * @return {string}
 */
export function getRefreshToken(): string | null {
  return token.refresh;
}

/**
 * Set application tokens
 * 
 * @param {string} access_token
 * @param {string} refresh_token
 */
export function setTokens(_ref: {
    refresh: string | null,
    access: string | null
}) {
  let {
    access,
    refresh
  } = _ref;
  token.access = access;
  token.refresh = refresh;
}

/**
 * Checks if the SDK is authenticated
 * 
 * @return {boolean}
 * 
 */
export function isAuthenticated(): boolean {
  return state.isLoggedIn;
}

/**
 * sets SDK authentication state
 */
export function setAuthenticationState(_state: boolean) {
  state.isLoggedIn = _state;
}


/**
 * Validates if a number is a rwandan phone
 * @param {string} number phone number to validate
 * @return {boolean}
 */
export function isPhoneNumber(number: string): boolean {
  const errors = {
    format: false
  };

  // Check it's a string
  // -----------------------------------------
  if (typeof number !== "string") {
    throw new Error("Input should be string");
  }
  const re = /^(\+?25)?(078|079|075|073|072)\d{7}$/;
  if (!re.test(number)) {
    return errors.format;
  }
  return true;
}

/**
 * Gets application secrets
 * 
 * @return {object}
 */
export function getSecrets(): object {
  return secrets;
}

/**
 * cheks SDK secrets availability
 * @return {void}
 */
export function checkSecrets(): void {
  if (!secrets.client_id) {
    throw new Error("Client id is required to authenticate.");
  }
  if (!secrets.client_secret) {
    throw new Error("Client secret is required to authenticate.");
  }
}



/**
 * Sets SDK secrets
 * 
 * @param {string} client_id
 * @param {string} client_secret
 * 
 * @return {void}
 */
export function setSecrets(_ref3: {
    client_id: string | null,
    client_secret: string | null
}) {
    let {
      client_id,
      client_secret
    } = _ref3;
    if (!client_id || !client_secret) {
      throw new Error("Application secrets required");
    }
    secrets.client_id = client_id;
    secrets.client_secret = client_secret;
  }


/**
 * Formats the query object into a string
 * @param {string} param query parameters
 * @return {string}
 */
export function getQueryString(param: Record<string, string | number>) {
    if (!param) return "";
    if (param && typeof param != "object") throw new TypeError("Filter parameters should be of type object.");
    if (param.limit && !param.offset) param.offset = '0';
    return Object.entries(omitBy(param, isNil)).map(_ref2 => {
      let [key, value] = _ref2;
      return "".concat(key, "=").concat(String(value));
    }).join("&");
  }

