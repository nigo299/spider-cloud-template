import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair; 把下面生成的公钥、私钥换成自己生成的即可
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGViLzhKeaQytzwnDIh5o5+trVUV/+nHZP4hfJeq217tOeW2nQylW8F4MFtI7d6fQQ63ZuBGv1+BMKGmKogqXhj9NYNZNwZreMXIZ85C1wnpm4nM81SkiI8Nv6LUIaVuQC3H+3/Yb4cXXunoEmIDaQuYU2zdXJwhIpIMdIvwRknQIDAQAB'
let JSEncryptor: JSEncrypt | undefined

// 加密
export function encrypt(txt: string, key = publicKey) {
  if (!JSEncryptor) {
    JSEncryptor = new JSEncrypt()
  }
  JSEncryptor.setPublicKey(key) // 设置公钥
  return JSEncryptor.encrypt(txt) // 对数据进行加密
}
