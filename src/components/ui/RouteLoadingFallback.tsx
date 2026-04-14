import React from 'react';

export const RouteLoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, rgba(78, 204, 163, 0.16), transparent 35%), linear-gradient(180deg, #0a0a0f 0%, #16213e 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: 'min(440px, 90vw)',
          padding: '28px',
          borderRadius: '20px',
          background: 'rgba(10, 10, 15, 0.72)',
          border: '1px solid rgba(78, 204, 163, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '3px solid rgba(78, 204, 163, 0.25)',
              borderTopColor: '#4ecca3',
              animation: 'route-loading-spin 0.9s linear infinite',
            }}
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Đang tải màn chơi</div>
            <div style={{ fontSize: '14px', color: '#b0b0b0' }}>Tách route để tải nhẹ hơn và vào màn nhanh hơn.</div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes route-loading-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RouteLoadingFallback;