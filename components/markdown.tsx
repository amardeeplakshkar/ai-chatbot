import Link from "next/link";
import React, { memo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Badge } from "./ui/badge";
import { MessageMermaid } from "./mermaid";
import { CodeBlockCode, CodeBlockGroup, CodeBlock } from "./ui/code-block";

const components: Partial<Components> = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "") || "";
    const codeContent = String(children).replace(/\n$/, "");
    const handleCopy = () => {
      navigator.clipboard.writeText(codeContent);
    };
    let contentToShow;
    switch (match[1]) {
      case "mermaid":
        contentToShow = <div className="text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900 flex items-center justify-center">
        <MessageMermaid source={codeContent} theme={"light"} />
        </div>
        break;
      default:
        contentToShow = (
          <>
            <CodeBlock>
              <CodeBlockGroup className="border-border border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium">
                    {match![1]}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleCopy}
                >
                  <Copy className="size-4" />
                </Button>
              </CodeBlockGroup>
              <CodeBlockCode
                code={codeContent}
                language={match![1] || "text"}
                theme={"dracula"}
              />
            </CodeBlock>
          </>
        );

        break;
    }
    return !inline && match ? (
      <>{contentToShow}</>
    ) : (
      <Badge className="whitespace-pre-wrap" {...props}>
        {children}
      </Badge>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table({ node, className, children, ...props }: any) {
    return (
      <div className="my-4 w-full overflow-x-auto">
        <Table className="rounded overflow-hidden" {...props}>
          {children}
        </Table>
      </div>
    );
  },
  thead({ node, ...props }: any) {
    return <TableHeader {...props} />;
  },
  tbody({ node, ...props }: any) {
    return <TableBody {...props} />;
  },
  tr({ node, ...props }: any) {
    return <TableRow {...props} />;
  },
  th({ node, ...props }: any) {
    return <TableHead className="" {...props} />;
  },
  td({ node, ...props }: any) {
    return <TableCell className="" {...props} />;
  },
  blockquote({ node, ...props }: any) {
    return (
      <blockquote
        className="border-l-4 pl-4 italic text-muted-foreground"
        {...props}
      />
    );
  },

  hr({ node, ...props }: any) {
    return <Separator className="my-6" {...props} />;
  },

  em({ node, ...props }: any) {
    return <em className="italic" {...props} />;
  },

  del({ node, ...props }: any) {
    return <del className="line-through text-muted-foreground" {...props} />;
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
