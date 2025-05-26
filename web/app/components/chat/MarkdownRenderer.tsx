"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/app/lib/utils";
import { useState, useMemo, useCallback } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
  isUser?: boolean;
}

// Memoized components for better performance
const InlineCode = ({ children, ...props }: any) => (
  <code
    className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded text-sm font-mono"
    {...props}
  >
    {children}
  </code>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <button
      type="button"
      className="flex items-center gap-1 px-2 py-1 text-xs text-primary/60 cursor-pointer"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export function MarkdownRenderer({
  content,
  className,
  isStreaming = false,
  isUser = false,
}: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    return (
      content
        .replace(/\\n/g, "\n")
        // Handle LaTeX math expressions
        .replace(
          /\$\$(.*?)\$\$/g,
          (match, p1) => `<div class="math-block">${p1}</div>`
        )
        .replace(
          /\$(.*?)\$/g,
          (match, p1) => `<span class="math-inline">${p1}</span>`
        )
    );
  }, [content]);

  const components = useMemo(
    () => ({
      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        const codeString = String(children).replace(/\n$/, "");

        if (!inline && match) {
          return (
            <div className="relative my-3 rounded-lg overflow-hidden border border-primary/20">
              <div className="flex justify-between items-center px-3 py-2 bg-primary/5">
                <span className="text-xs font-mono text-primary/60">
                  {match[1]}
                </span>
                <CopyButton text={codeString} />
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: "1rem",
                    background: "transparent",
                  }}
                  codeTagProps={{
                    style: {
                      background: "transparent",
                      backgroundColor: "transparent",
                    },
                  }}
                  className="!bg-primary/5 !text-xs"
                  showLineNumbers={codeString.split("\n").length > 5}
                  wrapLines
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        }

        return (
          <InlineCode className={className} {...props}>
            {children}
          </InlineCode>
        );
      },
      a: ({ node, className, children, href, ...props }: any) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 hover:underline inline-flex items-center gap-1 transition-colors"
          {...props}
        >
          {children}
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      ),

      input: ({ node, ...props }: any) => {
        if (props.type === "checkbox") {
          return (
            <input
              type="checkbox"
              disabled
              className="mr-2 rounded border-primary/40"
              {...props}
            />
          );
        }
        return <input {...props} />;
      },
    }),
    []
  );

  return (
    <div
      className={cn(
        "font-sans text-sm text-primary prose prose-sm prose-invert max-w-none",
        "prose-p:my-1.5 prose-headings:text-primary prose-headings:font-bold prose-headings:my-2",
        "prose-code:text-primary",
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0",
        "prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-primary prose-em:text-primary/90",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
        "prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:my-3 prose-blockquote:text-primary/80",
        "prose-hr:border-primary/30 prose-hr:my-3",
        "prose-th:p-2 prose-td:border-y prose-td:border-primary/30 prose-td:p-1.5",
        // Conditional classes
        isUser && "md-content-user",
        isStreaming && "streaming-content min-h-[24px]",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
