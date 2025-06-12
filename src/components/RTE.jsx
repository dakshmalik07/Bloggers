import React from 'react';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RTE({ 
  name, 
  control, 
  label, 
  defaultValue = "", 
  minLength = 100, // Minimum character count
  showCharCount = true 
}) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Function to strip HTML tags and get plain text length
  const getPlainTextLength = (html) => {
    if (!html) return 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent?.trim().length || 0;
  };

  return (
    <div className='w-full'>
      {label && (
        <label className='inline-block mb-3 text-lg font-semibold text-white'>
          {label}
        </label>
      )}

      <div className="quill-dark-theme">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={{
            validate: (value) => {
              const textLength = getPlainTextLength(value);
              if (textLength < minLength) {
                return `Content must be at least ${minLength} characters long. Current: ${textLength}`;
              }
              return true;
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const currentLength = getPlainTextLength(value);
            const isValidLength = currentLength >= minLength;
            
            return (
              <div className="w-full">
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={onChange}
                  modules={modules}
                  formats={formats}
                  className="w-full"
                  style={{ 
                    minHeight: '400px'
                  }}
                />
                
                {/* Character count and validation message */}
                <div className="mt-2 flex justify-between items-center">
                  {showCharCount && (
                    <div className={`text-sm ${
                      isValidLength 
                        ? 'text-green-400' 
                        : 'text-orange-400'
                    }`}>
                      {currentLength} / {minLength} characters minimum
                    </div>
                  )}
                  
                  {!isValidLength && currentLength > 0 && (
                    <div className="text-sm text-red-400">
                      Need {minLength - currentLength} more characters
                    </div>
                  )}
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="mt-2 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                    {error.message}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      <style jsx global>{`
        /* Dark theme styles for ReactQuill */
        .quill-dark-theme {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .quill-dark-theme .ql-toolbar {
          position: relative;
          z-index: 10;
        }

        .quill-dark-theme .ql-picker {
          position: relative;
        }

        .quill-dark-theme .ql-container {
          min-height: 350px;
          font-size: 16px;
        }

        .quill-dark-theme .ql-toolbar {
          background: rgba(30, 41, 59, 0.9) !important;
          border: 1px solid rgba(71, 85, 105, 0.6) !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          backdrop-filter: blur(10px);
          padding: 12px 16px !important;
        }

        .quill-dark-theme .ql-container {
          background: rgba(30, 41, 59, 0.7) !important;
          border: 1px solid rgba(71, 85, 105, 0.6) !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
          color: #f1f5f9 !important;
          backdrop-filter: blur(10px);
        }

        .quill-dark-theme .ql-editor {
          color: #f1f5f9 !important;
          background: transparent !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          padding: 20px !important;
          min-height: 350px !important;
          resize: vertical;
        }

        .quill-dark-theme .ql-editor::before {
          color: #94a3b8 !important;
          font-style: italic;
          content: 'Start writing your content here...';
        }

        .quill-dark-theme .ql-editor.ql-blank::before {
          color: #64748b !important;
          font-style: italic;
          left: 20px !important;
          right: 20px !important;
        }

        /* Toolbar button styles */
        .quill-dark-theme .ql-toolbar .ql-stroke {
          stroke: #cbd5e1 !important;
        }

        .quill-dark-theme .ql-toolbar .ql-fill {
          fill: #cbd5e1 !important;
        }

        .quill-dark-theme .ql-toolbar button {
          padding: 6px !important;
          margin: 2px !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        .quill-dark-theme .ql-toolbar button:hover {
          background: rgba(59, 130, 246, 0.2) !important;
          transform: translateY(-1px);
        }

        .quill-dark-theme .ql-toolbar button.ql-active {
          background: rgba(59, 130, 246, 0.4) !important;
          color: #60a5fa !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker {
          color: #f1f5f9 !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker-label {
          border: none !important;
          color: #f1f5f9 !important;
          padding: 6px 8px !important;
          border-radius: 6px !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker-label:hover {
          background: rgba(59, 130, 246, 0.2) !important;
        }

        /* FIXED: Hide picker options by default and show only when expanded */
        .quill-dark-theme .ql-toolbar .ql-picker-options {
          background: #1e293b !important;
          border: 1px solid rgba(71, 85, 105, 0.6) !important;
          border-radius: 8px !important;
          padding: 4px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          z-index: 9999 !important;
          position: absolute !important;
          display: none !important; /* Hide by default */
        }

        /* Show picker options only when picker is expanded */
        .quill-dark-theme .ql-toolbar .ql-picker.ql-expanded .ql-picker-options {
          display: block !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker-item {
          color: #f1f5f9 !important;
          padding: 8px 12px !important;
          border-radius: 4px !important;
          margin: 2px !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker-item:hover {
          background: rgba(59, 130, 246, 0.2) !important;
        }

        .quill-dark-theme .ql-toolbar .ql-picker-item.ql-selected {
          background: rgba(59, 130, 246, 0.3) !important;
        }

        /* Selected text highlighting */
        .quill-dark-theme .ql-editor .ql-selected {
          background: rgba(59, 130, 246, 0.3) !important;
        }

        /* Focus styles */
        .quill-dark-theme .ql-container.ql-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .quill-dark-theme .ql-toolbar.ql-focused,
        .quill-dark-theme .ql-container.ql-focused + .ql-toolbar {
          border-color: #3b82f6 !important;
        }

        /* Tooltip styles */
        .quill-dark-theme .ql-tooltip {
          background: #1e293b !important;
          border: 1px solid rgba(71, 85, 105, 0.6) !important;
          border-radius: 8px !important;
          color: #f1f5f9 !important;
          padding: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .quill-dark-theme .ql-tooltip input {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(71, 85, 105, 0.6) !important;
          color: #f1f5f9 !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
        }

        .quill-dark-theme .ql-tooltip input:focus {
          border-color: #3b82f6 !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }

        .quill-dark-theme .ql-tooltip button {
          background: #3b82f6 !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          margin-left: 8px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .quill-dark-theme .ql-tooltip button:hover {
          background: #2563eb !important;
          transform: translateY(-1px);
        }

        /* Scrollbar styling */
        .quill-dark-theme .ql-editor::-webkit-scrollbar {
          width: 8px;
        }

        .quill-dark-theme .ql-editor::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }

        .quill-dark-theme .ql-editor::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.6);
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .quill-dark-theme .ql-editor::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }

        /* Format-specific styles */
        .quill-dark-theme .ql-editor h1,
        .quill-dark-theme .ql-editor h2,
        .quill-dark-theme .ql-editor h3,
        .quill-dark-theme .ql-editor h4,
        .quill-dark-theme .ql-editor h5,
        .quill-dark-theme .ql-editor h6 {
          color: #f8fafc !important;
          font-weight: 600 !important;
          margin: 16px 0 8px 0 !important;
        }

        .quill-dark-theme .ql-editor p {
          color: #f1f5f9 !important;
          margin: 8px 0 !important;
        }

        .quill-dark-theme .ql-editor ul,
        .quill-dark-theme .ql-editor ol {
          color: #f1f5f9 !important;
          padding-left: 24px !important;
        }

        .quill-dark-theme .ql-editor li {
          color: #f1f5f9 !important;
          margin: 4px 0 !important;
        }

        .quill-dark-theme .ql-editor a {
          color: #60a5fa !important;
          text-decoration: underline !important;
        }

        .quill-dark-theme .ql-editor a:hover {
          color: #93c5fd !important;
        }

        .quill-dark-theme .ql-editor blockquote {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          color: #cbd5e1 !important;
          background: rgba(59, 130, 246, 0.1) !important;
          border-radius: 0 8px 8px 0 !important;
        }

        /* FIXED: Color picker specific styles - only show when expanded */
        .quill-dark-theme .ql-color-picker .ql-picker-options,
        .quill-dark-theme .ql-background .ql-picker-options {
          z-index: 10000 !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          min-width: 200px !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          display: none !important; /* Hide by default */
        }

        /* Show color picker options only when expanded */
        .quill-dark-theme .ql-color.ql-expanded .ql-picker-options,
        .quill-dark-theme .ql-background.ql-expanded .ql-picker-options {
          display: grid !important;
          grid-template-columns: repeat(8, 1fr) !important;
          gap: 2px !important;
          padding: 8px !important;
        }

        .quill-dark-theme .ql-color .ql-picker-item,
        .quill-dark-theme .ql-background .ql-picker-item {
          width: 20px !important;
          height: 20px !important;
          border-radius: 3px !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .quill-dark-theme .ql-color .ql-picker-item:hover,
        .quill-dark-theme .ql-background .ql-picker-item:hover {
          transform: scale(1.1) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
        }

        @media (max-width: 768px) {
          .quill-dark-theme .ql-toolbar {
            padding: 8px 12px !important;
          }
          
          .quill-dark-theme .ql-editor {
            padding: 16px !important;
            font-size: 14px !important;
          }
          
          .quill-dark-theme .ql-container {
            min-height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}