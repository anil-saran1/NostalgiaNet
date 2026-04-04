import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface FileObject {
  id: string;
  file: File;
  name: string;
}

const FileManager = () => {
  const [files, setFiles] = useState<FileObject[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file: file,
      name: file.name,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(
      files.map((file) => (file.id === id ? { ...file, name: newName } : file))
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,accept: undefined,
  });

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file.file, file.name);
    });

    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div
        {...getRootProps({
          className: 'dropzone border-dashed border-2 border-gray-400 p-6 rounded-lg',
        })}
      >
        <input {...getInputProps()} />
        <p>Drag and drop files here, or click to select files</p>
      </div>

      <div className="mt-4 space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex justify-between items-center p-2 border rounded-md shadow"
          >
            <input
              type="text"
              value={file.name}
              onChange={(e) => renameFile(file.id, e.target.value)}
              className="w-1/2 border rounded p-1"
            />
            <button
              onClick={() => removeFile(file.id)}
              className="ml-4 p-1 bg-red-400 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Upload Files
        </button>
      )}
    </div>
  );
};

export default FileManager;
