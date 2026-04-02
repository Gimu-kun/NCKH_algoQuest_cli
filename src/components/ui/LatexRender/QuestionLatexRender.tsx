import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

export const RenderLatex = ({ content, images }: { content: string; images?: any[] }) => {
    const processed = content.replace(/#pic(\d+)/g, (match, num) => {
        const idx = parseInt(num) - 1;
        return images?.[idx] ? `<img src="http://localhost:8080${images[idx].url}" class="inline-q-img" />` : match;
    }).replace(/\\\\/g, '\\');

    return (
        <div className="latex-content">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                {processed}
            </ReactMarkdown>
        </div>
    );
};
