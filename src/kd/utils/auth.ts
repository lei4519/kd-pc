import Cookies from 'js-cookie'
const TokenKey1 = 'B_UID'
const TokenKey2 = 'B_TOKEN'
const TokenKey3 = 'B_PHPSESSID'

export function getToken() {
  return {
    userId: Cookies.get(TokenKey1),
    token: Cookies.get(TokenKey2),
    sessionId: Cookies.get(TokenKey3)
  }
}

export function setToken(token: string) {
  return Cookies.set(TokenKey1, token, { path: '/' })
  // return Cookies.set(TokenKey1, token, { path: '/', domain: '.leju.com' })
}

export function removeToken() {
  Cookies.remove(TokenKey1, { path: '/' })
  // Cookies.remove(TokenKey1, { path: '/', domain: '.leju.com' })
  Cookies.remove(TokenKey2, { path: '/' })
  // Cookies.remove(TokenKey2, { path: '/', domain: '.leju.com' })
  Cookies.remove(TokenKey3, { path: '/' })
  // Cookies.remove(TokenKey3, { path: '/', domain: '.leju.com' })
  return true
}
