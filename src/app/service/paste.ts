const encoder = new TextEncoder()
const decoder = new TextDecoder()



const EncryptPayload = async (plaintext: string, password: string) => {
  
  const iv = genAESInitVector()
  const baseKey = await genAESKey()
  const keyView = await window.crypto.subtle.exportKey("raw", baseKey)
  
  let encryptionKey = baseKey
  
  if (password) {
    encryptionKey = await deriveKeyFromPassword(keyView, password)
  }
  
  const ciphertext = await window.crypto.subtle.encrypt(
    {name: "AES-GCM", iv: iv},
    encryptionKey,
    encoder.encode(plaintext)
  )
  const signature = await signPayload(encryptionKey, plaintext)
  return {
    iv: iv,
    ciphertext: new Uint8Array(ciphertext),
    signature: new Uint8Array(signature),
    key: new Uint8Array(keyView)
  }
}

const DecryptPaste = async (
  ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array, password: string | null
): Promise<Uint8Array> => {
  let encryptionKey = await window.crypto.subtle.importKey(
    "raw", key, {name: "AES-GCM"}, true, ["decrypt"]
  )
  if (password) {
    encryptionKey = await deriveKeyFromPassword(key, password)
  }
  const plaintext = await window.crypto.subtle.decrypt(
    {name: "AES-GCM", iv}, encryptionKey, ciphertext
  )
  return new Uint8Array(plaintext)
}

const genAESInitVector = () => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

const genAESKey = async () => {
  return await window.crypto.subtle.generateKey(
    {name: "AES-GCM", length: 256},
    true, 
    ["encrypt"]
  )
}

const deriveKeyFromPassword = async (baseKey: ArrayBuffer | Uint8Array, password: string) => {
  const ikm = await crypto.subtle.importKey(
    "raw", baseKey, "HKDF", false, ["deriveKey"]
  )

  return await crypto.subtle.deriveKey({
      name: "HKDF",
      salt: encoder.encode(password),
      hash: "SHA-256",
      info: encoder.encode("")
    },
    ikm,
    {name: "AES-GCM", length: 256},
    true,
    ["encrypt", "decrypt"]
  )
}

const signPayload = async (encryptionKey: CryptoKey, plaintext: string) => {
  const keyRaw = await window.crypto.subtle.exportKey("raw", encryptionKey);
  const signKey = await window.crypto.subtle.importKey(
    "raw", keyRaw, {
      name:"HMAC",
      hash: {name: "SHA-256"},
    }, false, ["sign"]
  )
  return await window.crypto.subtle.sign("HMAC", signKey, encoder.encode(plaintext));
}

const ProofOfKnowlege = async (encryptionKey: Uint8Array | ArrayBuffer, plaintext: string, password: string | null): Promise<Uint8Array> => {
  if (password) {
    const derivedKey = await deriveKeyFromPassword(encryptionKey, password)
    encryptionKey = await window.crypto.subtle.exportKey("raw", derivedKey);
  }
  const signKey = await window.crypto.subtle.importKey(
    "raw", encryptionKey, {
      name:"HMAC",
      hash: {name: "SHA-256"},
    }, false, ["sign"]
  )
  const signature = await window.crypto.subtle.sign("HMAC", signKey, encoder.encode(plaintext));
  return new Uint8Array(signature)
}

export {
  EncryptPayload,
  DecryptPaste,
  ProofOfKnowlege
}
