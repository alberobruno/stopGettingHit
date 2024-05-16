import React, { useState } from 'react';
import axios from 'axios';

type SlpFile = {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};

const CustomFileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [invalidFileType, setInvalidFileType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const validFiles = newFiles.filter((file: SlpFile) =>
      file.name.endsWith('.slp')
    );
    const hasInvalidFiles = newFiles.length !== validFiles.length;

    setInvalidFileType(hasInvalidFiles);
    setFiles(validFiles);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length > 0) {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));

      try {
        await axios.post('http://localhost:8080/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Upload successful');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Upload failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="custom-file-uploader">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".slp" multiple />
        {invalidFileType && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            Invalid file type. Only .slp files are allowed.
          </div>
        )}
        <button
          type="submit"
          disabled={files.length === 0 || invalidFileType || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Matches'}
        </button>
      </form>
    </div>
  );
};

export default CustomFileUploader;
