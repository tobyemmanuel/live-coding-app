import React from 'react';

interface FileExplorerProps {
  files: string[];
  onSelectFile: (file: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile }) => {
  return (
    <div className="file-explorer">
      <h3 className="font-bold mb-2">Files</h3>
      <ul>
        {files.map((file) => (
          <li
            key={file}
            className="cursor-pointer hover:bg-gray-700 p-1 rounded"
            onClick={() => onSelectFile(file)}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};
