import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';
import { Copy, Check } from 'lucide-react';

const MarkdownRenderer = ({ content, className = '' }) => {
  const { isDark } = useTheme();
  const [copiedCode, setCopiedCode] = React.useState('');

  const copyCodeToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const components = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!inline && language) {
        return (
          <div className="relative group">
            {/* Copy button */}
            <button
              onClick={() => copyCodeToClipboard(code)}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 
                text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10
                flex items-center gap-1 text-xs"
              title="Copy code"
            >
              {copiedCode === code ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
            
            {/* Syntax highlighter */}
            <SyntaxHighlighter
              style={isDark ? oneDark : oneLight}
              language={language}
              PreTag="div"
              className="!mt-0 !mb-4 rounded-lg overflow-hidden"
              showLineNumbers={code.split('\n').length > 5}
              wrapLines={true}
              wrapLongLines={true}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      // Inline code
      return (
        <code 
          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
            rounded text-sm font-mono border border-gray-200 dark:border-gray-700"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Enhanced headings
    h1({ children }) {
      return (
        <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">
          {children}
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">
          {children}
        </h4>
      );
    },
    h5({ children }) {
      return (
        <h5 className="text-sm font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">
          {children}
        </h5>
      );
    },
    h6({ children }) {
      return (
        <h6 className="text-sm font-medium mb-2 mt-3 text-gray-700 dark:text-gray-300">
          {children}
        </h6>
      );
    },

    // Enhanced paragraphs
    p({ children }) {
      return (
        <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200 last:mb-0">
          {children}
        </p>
      );
    },

    // Enhanced links
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
            underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },

    // Enhanced lists
    ul({ children }) {
      return (
        <ul className="mb-4 pl-6 space-y-1 text-gray-800 dark:text-gray-200 list-disc">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="mb-4 pl-6 space-y-1 text-gray-800 dark:text-gray-200 list-decimal">
          {children}
        </ol>
      );
    },
    li({ children }) {
      return (
        <li className="leading-relaxed">
          {children}
        </li>
      );
    },

    // Enhanced blockquotes
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 mb-4 
          bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 italic rounded-r-md">
          {children}
        </blockquote>
      );
    },

    // Enhanced tables
    table({ children }) {
      return (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return (
        <thead className="bg-gray-100 dark:bg-gray-800">
          {children}
        </thead>
      );
    },
    tbody({ children }) {
      return (
        <tbody className="bg-white dark:bg-gray-900">
          {children}
        </tbody>
      );
    },
    th({ children }) {
      return (
        <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 
          border-b border-gray-300 dark:border-gray-600">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-4 py-2 text-gray-800 dark:text-gray-200 
          border-b border-gray-200 dark:border-gray-700">
          {children}
        </td>
      );
    },

    // Horizontal rules
    hr() {
      return (
        <hr className="my-6 border-t-2 border-gray-200 dark:border-gray-700" />
      );
    },

    // Enhanced emphasis
    strong({ children }) {
      return (
        <strong className="font-bold text-gray-900 dark:text-gray-100">
          {children}
        </strong>
      );
    },
    em({ children }) {
      return (
        <em className="italic text-gray-800 dark:text-gray-200">
          {children}
        </em>
      );
    },

    // Task lists (GitHub-style checkboxes)
    input({ type, checked, ...props }) {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className="mr-2 accent-blue-600 dark:accent-blue-400"
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    },
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;