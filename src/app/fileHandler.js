"use client";

import React, { useState } from "react";
import useEncryptFiles from "./useEncryptFiles";
import useDecryptFiles from "./useDecryptFiles";
import { Button } from "@nextui-org/react";

export default function FileEncryptor() {
  const { encryptedFiles, handleEncryptFiles } = useEncryptFiles();
  const { decryptedFiles, handleDecryptFiles } = useDecryptFiles();

  const [encryptFileCount, setEncryptFileCount] = useState(0); // State for encryption file count
  const [decryptFileCount, setDecryptFileCount] = useState(0); // State for decryption file count
  const [showEncryptForm, setShowEncryptForm] = useState(true); // Toggle form display

  // Handle input change for encryption form
  const handleEncryptFileInputChange = (event) => {
    setEncryptFileCount(event.target.files.length);
  };

  // Handle input change for decryption form
  const handleDecryptFileInputChange = (event) => {
    setDecryptFileCount(event.target.files.length);
  };

  // Toggle between encryption and decryption forms
  const toggleForm = () => {
    setShowEncryptForm(!showEncryptForm);
  };

  // Download all files (used for both encrypted and decrypted files)
  const downloadAllFiles = (files) => {
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Enkripsi dan Dekripsi Berkas
      </h2>

      {showEncryptForm ? (
        <div className="mb-6">
          {/* Encryption Form */}
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              {encryptFileCount > 0 ? (
                <p className="mb-2 text-sm text-gray-500 px-6">
                  <span className="font-semibold">
                    Total berkas dipilih: {encryptFileCount}
                  </span>
                </p>
              ) : (
                <p className="mb-2 text-sm text-gray-500 px-6">
                  <span className="font-semibold">
                    Klik untuk mengunggah
                  </span>{" "}
                  atau seret dan jatuhkan
                </p>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              multiple
              className="hidden"
              onChange={handleEncryptFileInputChange}
            />
          </label>

          <Button
            onClick={handleEncryptFiles}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
          >
            Enkripsi Berkas
          </Button>

          <div id="fileInput" className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Berkas Terenkripsi
            </h3>
            {encryptedFiles.length > 0 ? (
              <>
                <Button
                  onClick={() => downloadAllFiles(encryptedFiles)}
                  className="mb-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-150"
                >
                  Unduh Semua Berkas Terenkripsi
                </Button>
                {encryptedFiles.map((file) => (
                  <div key={file.name} className="mb-2">
                    <a
                      href={file.url}
                      download={file.name}
                      className="text-blue-500 hover:underline"
                    >
                      Unduh Berkas Terenkripsi {file.name}
                    </a>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500">
                Tidak ada berkas terenkripsi yang tersedia.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          {/* Decryption Form */}
          <label
            htmlFor="decryptFileInput"
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              {decryptFileCount > 0 ? (
                <p className="mb-2 text-sm text-gray-500 px-6">
                  <span className="font-semibold">
                    Total berkas dipilih: {decryptFileCount}
                  </span>
                </p>
              ) : (
                <p className="mb-2 text-sm text-gray-500 px-6">
                  <span className="font-semibold">
                    Klik untuk mengunggah
                  </span>{" "}
                  atau seret dan jatuhkan
                </p>
              )}
            </div>
            <input
              id="decryptFileInput"
              type="file"
              multiple
              className="hidden"
              onChange={handleDecryptFileInputChange}
            />
          </label>
          <Button
            onClick={handleDecryptFiles}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150"
          >
            Dekripsi Berkas
          </Button>

          <div id="decryptedFilesContainer" className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Berkas Terdekripsi
            </h3>
            {decryptedFiles.length > 0 ? (
              <>
                <Button
                  onClick={() => downloadAllFiles(decryptedFiles)}
                  className="mb-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-150"
                >
                  Unduh Semua Berkas Terdekripsi
                </Button>
                {decryptedFiles.map((file) => (
                  <div key={file.name} className="mb-2">
                    <a
                      href={file.url}
                      download={file.name}
                      className="text-blue-500 hover:underline"
                    >
                      Unduh Berkas Terdekripsi {file.name}
                    </a>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500">
                Tidak ada berkas terdekripsi yang tersedia.
              </p>
            )}
          </div>
        </div>
      )}
      <Button
        onClick={toggleForm}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-150"
      >
        {showEncryptForm ? "Ganti Jadi Dekripsi" : "Ganti Jadi Enkripsi"} Berkas
      </Button>
    </div>
  );
}
