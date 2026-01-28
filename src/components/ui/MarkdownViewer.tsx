import React from 'react';

interface MarkdownViewerProps {
    content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    // Simple regex-based markdown parser for basic formatting
    // Supports: Headers (#), Bold (**), Italic (*), Lists (-), Code (`), Blockquotes (>)

    const parseMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];

        let inList = false;
        let listItems: React.ReactNode[] = [];

        lines.forEach((line, index) => {
            // Trim whitespace
            let cleanLine = line.trim();

            // Handle Lists
            if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
                inList = true;
                const itemContent = parseInline(cleanLine.substring(2));
                listItems.push(<li key={`li-${index}`}>{itemContent}</li>);
                return;
            } else if (inList) {
                inList = false;
                elements.push(<ul key={`ul-${index}`} className="md-list">{listItems}</ul>);
                listItems = [];
            }

            // Empty lines
            if (!cleanLine) {
                return;
            }

            // Headers
            if (cleanLine.startsWith('### ')) {
                elements.push(<h3 key={index} className="md-h3">{cleanLine.substring(4)}</h3>);
            } else if (cleanLine.startsWith('## ')) {
                elements.push(<h2 key={index} className="md-h2">{cleanLine.substring(3)}</h2>);
            } else if (cleanLine.startsWith('# ')) {
                elements.push(<h1 key={index} className="md-h1">{cleanLine.substring(2)}</h1>);
            }
            // Blockquotes
            else if (cleanLine.startsWith('> ')) {
                elements.push(<blockquote key={index} className="md-quote">{parseInline(cleanLine.substring(2))}</blockquote>);
            }
            // Paragraphs
            else {
                elements.push(<p key={index} className="md-p">{parseInline(cleanLine)}</p>);
            }
        });

        // Flush remaining list
        if (inList) {
            elements.push(<ul key="ul-last" className="md-list">{listItems}</ul>);
        }

        return elements;
    };

    const parseInline = (text: string): React.ReactNode => {
        // Split by code blocks first to protect them
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} className="md-code-inline">{part.slice(1, -1)}</code>;
            }

            // Bold
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((subPart, j) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={`${i}-${j}`}>{subPart.slice(2, -2)}</strong>;
                }
                return subPart;
            });
        });
    };

    return (
        <div className="markdown-content">
            {parseMarkdown(content)}
            <style>{`
                .markdown-content { color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; }
                .md-h1 { color: #818cf8; font-size: 1.8rem; margin: 0 0 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
                .md-h2 { color: #a5b4fc; font-size: 1.4rem; margin: 1.5rem 0 0.8rem; }
                .md-h3 { color: #c4b5fd; font-size: 1.1rem; margin: 1.2rem 0 0.6rem; }
                .md-p { margin-bottom: 1rem; }
                .md-list { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                .md-list li { margin-bottom: 0.4rem; }
                .md-quote { border-left: 3px solid #6366f1; padding-left: 1rem; margin: 1rem 0; color: #94a3b8; font-style: italic; background: rgba(99,102,241,0.05); padding: 0.5rem 1rem; border-radius: 0 4px 4px 0; }
                .md-code-inline { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: #fbbf24; font-family: monospace; font-size: 0.9em; }
            `}</style>
        </div>
    );
};
