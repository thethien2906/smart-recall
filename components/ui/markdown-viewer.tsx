"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={{
          // Customize code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className={`${className} block overflow-x-auto`} {...props}>
                {children}
              </code>
            );
          },
          // Make links open in new tab
          a: ({ node, children, href, ...props }: any) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
          // Style pre blocks
          pre: ({ node, children, ...props }: any) => (
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 my-4" {...props}>
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
