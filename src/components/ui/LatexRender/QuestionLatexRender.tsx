import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MathPluginsState {
    remarkMath: unknown;
    rehypeKatex: unknown;
    ready: boolean;
}

export const RenderLatex = ({ content, images }: { content: string; images?: any[] }) => {
    const [mathPlugins, setMathPlugins] = useState<MathPluginsState | null>(null);

    const hasMathSyntax = useMemo(() => {
        return /\$[^$]+\$|\\\(|\\\[/.test(content);
    }, [content]);

    useEffect(() => {
        if (!hasMathSyntax) {
            setMathPlugins(null);
            return;
        }

        let active = true;

        const loadMathPlugins = async () => {
            const [{ default: remarkMath }, { default: rehypeKatex }] = await Promise.all([
                import('remark-math'),
                import('rehype-katex'),
                import('katex/dist/katex.min.css')
            ]);

            if (!active) return;

            setMathPlugins({
                remarkMath,
                rehypeKatex,
                ready: true
            });
        };

        void loadMathPlugins();

        return () => {
            active = false;
        };
    }, [hasMathSyntax]);

    const processed = content.replace(/#pic(\d+)/g, (match, num) => {
        const idx = parseInt(num) - 1;
        return images?.[idx] ? `<img src="http://localhost:8080${images[idx].url}" class="inline-q-img" />` : match;
    }).replace(/\\\\/g, '\\');

    const remarkPlugins = hasMathSyntax && mathPlugins?.ready ? [mathPlugins.remarkMath] : [];
    const rehypePlugins = hasMathSyntax && mathPlugins?.ready
        ? [mathPlugins.rehypeKatex, rehypeRaw]
        : [rehypeRaw];

    return (
        <div className="latex-content">
            <ReactMarkdown remarkPlugins={remarkPlugins as any[]} rehypePlugins={rehypePlugins as any[]}>
                {processed}
            </ReactMarkdown>
        </div>
    );
};
