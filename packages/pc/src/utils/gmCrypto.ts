import { sm2, sm4 } from 'sm-crypto'

const key = '1d3891802c7f32b284e4de17d9bd53b1'

export function sm4Encrypt(data: any) {
  const result = sm4.encrypt(data, key)
  return result
}

// 解密方法
export function sm4Decrypt(data: any) {
  if (!data.length) {
    return ''
  }
  else {
    const result = sm4.decrypt(data, key)
    return result.replace(/\s/g, '')
  }
}

const sm2PrivateKey = '48dbd74d5e047022e761167144b75082a20ea69c611812a74b335be6efcb1df8'

export function sm2Encrypt(data: any) {
  const signature = sm2.doSignature(JSON.stringify(data), sm2PrivateKey, { hash: true, der: true })
  return signature
}
