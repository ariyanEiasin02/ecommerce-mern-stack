"use client";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: 180,
        border: "1.5px solid #e2e8f0",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: 14,
        background: "#fafafa",
      }}
    >
      Loading editor...
    </div>
  ),
});

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "blockquote",
  "code-block",
  "link",
];

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  hasError?: boolean;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  minHeight = 200,
  hasError = false,
}) => {
  return (
    <div
      className={`quill-editor-wrapper ${hasError ? "quill-error" : ""}`}
      style={
        {
          "--quill-min-height": `${minHeight}px`,
        } as React.CSSProperties
      }
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
};

export default QuillEditor;
