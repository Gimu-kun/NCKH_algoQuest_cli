/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ĐIỂM KHỞI CHẠY (Entry Point)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Điểm bắt đầu thực thi của ứng dụng React (React Client Entry).
 * 
 * CHỨC NĂNG:
 * - Mount ứng dụng vào DOM (#root).
 * - Import CSS toàn cục.
 * 
 * @file main.tsx
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
<<<<<<< HEAD
    <HashRouter>
        <App />
    </HashRouter>
=======
    <App />
>>>>>>> ac59ce48f7195ff8f7319183ac018758e482cd4b
)
