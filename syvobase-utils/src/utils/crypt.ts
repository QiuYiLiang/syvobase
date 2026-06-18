import CryptoJS from 'crypto-js'

const key = 'hharstrastratrastieanpt'

export function encrypt(str: string) {
  return CryptoJS.AES.encrypt(str, key).toString()
}

export function decrypt(str: string) {
  return CryptoJS.AES.decrypt(str, key).toString()
}

export function encryptJson(json: Record<string, any>) {
  return CryptoJS.AES.encrypt(JSON.stringify(json), key).toString()
}

export function decryptJson(jsonStr: string) {
  return JSON.parse(CryptoJS.AES.decrypt(jsonStr, key).toString())
}
