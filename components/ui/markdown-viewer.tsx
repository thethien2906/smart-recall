"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/atom-one-light.css";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={{
          // Customize code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border" {...props}>
                {children}
              </code>
            ) : (
              <code className={`${className} block text-sm leading-relaxed font-mono`} {...props}>
                {children}
              </code>
            );
          },
          // Make links open in new tab
          a: ({ node, children, href, ...props }: any) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props}>
              {children}
            </a>
          ),
          // Style pre blocks
          pre: ({ node, children, ...props }: any) => (
            <pre className="!overflow-x-auto rounded-lg p-4 my-4 shadow-sm border" style={{ background: '#fafafa' }} {...props}>
              {children}
            </pre>
          ),
          // Better paragraph spacing
          p: ({ node, children, ...props }: any) => (
            <p className="leading-relaxed my-3" {...props}>
              {children}
            </p>
          ),
          // Better heading styles
          h1: ({ node, children, ...props }: any) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }: any) => (
            <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }: any) => (
            <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>
              {children}
            </h3>
          ),
          // Better list styling
          ul: ({ node, children, ...props }: any) => (
            <ul className="list-disc list-inside space-y-1 my-3" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }: any) => (
            <ol className="list-decimal list-inside space-y-1 my-3" {...props}>
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
