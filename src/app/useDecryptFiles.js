import { useState } from 'react';
import { deriveKey, decryptData } from './keyHandler';
import pako from 'pako';

const useDecryptFiles = () => {
  const [decryptedFiles, setDecryptedFiles] = useState([]);

  const handleDecryptFiles = async () => {
    try {
      const decryptFileInput = document.getElementById('decryptFileInput');
      if (decryptFileInput.files.length === 0) {
        alert('Please select encrypted files to decrypt.');
        return;
      }

      const files = decryptFileInput.files;
      const decryptedFiles = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();

        const salts = [];
        const ivs = [];
        let offset = 0;
        const saltSize = 16;
        const ivSize = 12;

        for (let i = 0; i < 2; i++) {  
          const salt = new Uint8Array(arrayBuffer.slice(offset, offset + saltSize));
          salts.push(salt);
          offset += saltSize;
        }

        for (let i = 0; i < 2; i++) {  
          const iv = new Uint8Array(arrayBuffer.slice(offset, offset + ivSize));
          ivs.push(iv);
          offset += ivSize;
        }

        const encryptedData = new Uint8Array(arrayBuffer.slice(offset));
        const password = prompt(`Enter the password for decrypting ${file.name}:`);
        if (!password) {
          alert('Password is required.');
          return;
        }

        let decryptedData = encryptedData;
        for (let i = ivs.length - 1; i >= 0; i--) {
          const key = await deriveKey(password + `Layer${i + 1}`, salts[i]);
          decryptedData = await decryptData(decryptedData, key, ivs[i]);
        }

        const decompressedData = pako.inflate(new Uint8Array(decryptedData));

        const blob = new Blob([decompressedData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        decryptedFiles.push({ name: file.name, url });
      }

      setDecryptedFiles(decryptedFiles);
    } catch (error) {
      console.error('Decryption error:', error);
      alert('An error occurred during decryption. Check the console for details.');
    }
  };

  return { decryptedFiles, handleDecryptFiles };
};

export default useDecryptFiles;
