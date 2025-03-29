import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Link,
} from "@mui/material";

/**
 * Znovupoužitelná komponenta pro vykreslování markdownového obsahu
 * s podporou MUI stylů pro tabulky a další elementy.
 *
 * @param {{ content: string }} props
 */
const MarkdownRenderer = ({ content }) => {
  const components = {
    table: ({ children }) => (
      <Table size="small" sx={{ mt: 2 }}>
        {children}
      </Table>
    ),
    thead: ({ children }) => <TableHead>{children}</TableHead>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => (
      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
        {children}
      </TableCell>
    ),
    td: ({ children }) => <TableCell>{children}</TableCell>,

    h1: ({ children }) => (
      <Typography variant="h4" gutterBottom>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h5" gutterBottom>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h6" gutterBottom>
        {children}
      </Typography>
    ),
    p: ({ children }) => <Typography paragraph>{children}</Typography>,
    a: ({ href, children }) => (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    ),
    ul: ({ children }) => <ul style={{ paddingLeft: "1.5rem" }}>{children}</ul>,
    li: ({ children }) => <li>{children}</li>,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
