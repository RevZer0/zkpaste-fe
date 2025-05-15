"use client"


export default function Button({target, password}) {
  async function handleClick() {
    // 1. Generate initialization vector
    // 2. Generate cipher key
    // 3. Generate AES-GCM ciphertextA
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const plaintext = target.current.value;
    const passwordtext = password.current.value;
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    let key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true, 
      [
        "encrypt", "decrypt"
      ]
    )
    if (passwordtext) {
      const rawbase = await window.crypto.subtle.exportKey("raw", key);
      const ikm = await crypto.subtle.importKey(
        "raw", rawbase, "HKDF", false, ["deriveKey"]
      )
      key = await crypto.subtle.deriveKey({
          name: "HKDF",
          salt: encoder.encode(passwordtext),
          hash: "SHA-256",
          info: encoder.encode("")
        },
        ikm,
        {name: "AES-GCM", length: 256},
        true,
        ["encrypt", "decrypt"]
      )
    }
    const keytext = await window.crypto.subtle.exportKey("raw", key);
    const ciphertext = await window.crypto.subtle.encrypt(
      {name: "AES-GCM", iv: iv},
      key,
      encoder.encode(plaintext)
    )
    const signkey = await window.crypto.subtle.importKey("raw", keytext, {
      name:"HMAC",
      hash: {name: "SHA-256"},
    }, false, ["sign"]);
    const signature = await window.crypto.subtle.sign("HMAC", signkey, encoder.encode(plaintext));
    const payload = {
      iv: btoa(String.fromCharCode(...iv)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      signature:  btoa(String.fromCharCode(...new Uint8Array(signature)))
    }
    console.log("Password " + passwordtext);
    console.log("KEY " + btoa(String.fromCharCode(...new Uint8Array(keytext))));
    console.log(payload)

    const decodedtext = await window.crypto.subtle.decrypt({name: "AES-GCM", iv}, key, ciphertext);
    console.log("Decoded " + decoder.decode(decodedtext));
  }

  return <button type="button" onClick={handleClick}>Go!</button>

