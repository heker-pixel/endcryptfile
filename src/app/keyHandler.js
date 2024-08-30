export async function deriveKey(password, salt) {
    try {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
  
      return window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 200000,
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Key derivation error:', error);
      throw error;
    }
  }
  
  export async function encryptData(data, key, iv) {
    try {
      return window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }
  
  export async function decryptData(data, key, iv) {
    try {
      return window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }
  