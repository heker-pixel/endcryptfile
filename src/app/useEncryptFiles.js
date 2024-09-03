import { useState } from 'react';
import { deriveKey, encryptData } from './keyHandler';
import pako from 'pako';  // Import the pako library for Deflate compression

const useEncryptFiles = () => {
  const [encryptedFiles, setEncryptedFiles] = useState([]);

  const handleEncryptFiles = async () => {
    try {
      const fileInput = document.getElementById('fileInput');
      if (fileInput.files.length === 0) {
        alert('Please select files to encrypt.');
        return;
      }

      const files = fileInput.files;
      const layers = 2;  
      const encryptedFiles = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const password = prompt(`Enter a password for encrypting ${file.name}:`);
        if (!password) {
          alert('Password is required.');
          return;
        }

        const compressedData = pako.deflate(new Uint8Array(arrayBuffer));
        
        const salts = [];
        const ivs = [];
        let encryptedData = compressedData.buffer;

        for (let i = 0; i < layers; i++) {
          const salt = window.crypto.getRandomValues(new Uint8Array(16));
          const key = await deriveKey(password + `Layer${i + 1}`, salt);
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          encryptedData = await encryptData(encryptedData, key, iv);

          salts.push(salt);
          ivs.push(iv);
        }

        const combinedData = new Uint8Array(
          salts.reduce((acc, salt) => acc + salt.byteLength, 0) +
          ivs.reduce((acc, iv) => acc + iv.byteLength, 0) +
          encryptedData.byteLength
        );

        let offset = 0;
        for (const salt of salts) {
          combinedData.set(salt, offset);
          offset += salt.byteLength;
        }

        for (const iv of ivs) {
          combinedData.set(iv, offset);
          offset += iv.byteLength;
        }

        combinedData.set(new Uint8Array(encryptedData), offset);

        const blob = new Blob([combinedData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        encryptedFiles.push({ name: file.name, url });
      }

      setEncryptedFiles(encryptedFiles);
    } catch (error) {
      console.error('Encryption error:', error);
      alert('An error occurred during encryption. Check the console for details.');
    }
  };

  return { encryptedFiles, handleEncryptFiles };
};

export default useEncryptFiles;
