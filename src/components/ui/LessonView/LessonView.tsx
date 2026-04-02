import React, { useState } from 'react';
import './LessonView.css';
import SmartContentDetailRender from './SmartContentDetailRender';
import SectionDetailItem from './SectionDetailItem';

interface LessonProps {
    lesson: any;
}

export const LessonView: React.FC<LessonProps> = ({ lesson }) => {
    const filteredSections = lesson.sections.filter((sec:any)=>sec.level == 1);
    const [activeSection, setActiveSection] = useState<string>('');

    // Hàm đệ quy để lấy tất cả tiêu đề cho Mục lục (Sidebar)
    const renderTableOfContents = (sections: any[]) => {
        return sections.map((section) => (
            <div key={section.id} className={`toc-item level-${section.level}`}>
                <a 
                    href={`#${section.id}`} 
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => setActiveSection(section.id)}
                >
                    {section.title}
                </a>
                {section.children && section.children.length > 0 && (
                    <div className="toc-children">
                        {renderTableOfContents(section.children)}
                    </div>
                )}
            </div>
        ));
    };

    // Hàm đệ quy để hiển thị nội dung chi tiết (Main Content)
    const renderSections = (sections: any[]) => {
        console.log(sections)
        return sections.map((section) => (
            <div 
                key={section.id} 
                id={section.id} 
                className={`content-section level-${section.level}`}
            >
                <h3 className={`heading-level-${section.level}`}>
                    {section.title}
                </h3>
                
                <SectionDetailItem section={section}/>

                {/* Render Media: Refs (Video/Link) */}
                {section.refs?.map((ref: any) => (
                    <div key={ref.id} className="reference-box">
                        <h3 className='heading-level-1'>Tài nguyên tham khảo</h3>
                        {ref.type.toLowerCase() === 'video' ? (
                            <div className="video-wrapper">
                                <iframe 
                                    src={ref.url.replace("youtu.be/", "www.youtube.com/embed/").split('?')[0]} 
                                    title="video" 
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <a href={ref.url} target="_blank" rel="noreferrer" className="ref-link">
                                📄 Tài liệu tham khảo: {ref.url}
                            </a>
                        )}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="lesson-container">
            {/* SIDEBAR: Mục lục chương mục */}
            <aside className="lesson-sidebar">
                <div className="sidebar-header">MỤC LỤC</div>
                <nav className="toc-nav">
                    {renderTableOfContents(filteredSections)}
                </nav>
            </aside>

            {/* MAIN CONTENT: Bố cục dạng Word */}
            <main className="lesson-main-paper">
                <div className="word-page">
                    <header className="page-header">
                        <div className="topic-title">{lesson.topic?.title}</div>
                        <h1 className="lesson-title">{lesson.title}</h1>
                    </header>
                    
                    <div className="page-content">
                        {renderSections(filteredSections)}
                    </div>
                </div>
            </main>
        </div>
    );
};