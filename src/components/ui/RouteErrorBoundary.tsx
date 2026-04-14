import React from 'react';

type RouteErrorBoundaryProps = {
  children: React.ReactNode;
};

type RouteErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RouteErrorBoundary] Unhandled route error:', error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              width: 'min(520px, 100%)',
              padding: '32px',
              borderRadius: '20px',
              background: 'rgba(26, 26, 46, 0.92)',
              border: '1px solid rgba(231, 76, 60, 0.35)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
              textAlign: 'center',
            }}
          >
            <h1 style={{ marginBottom: '12px', fontSize: '30px' }}>Đã xảy ra lỗi khi tải màn</h1>
            <p style={{ marginBottom: '20px', color: '#b0b0b0', lineHeight: 1.6 }}>
              Một route hoặc component con đã gặp lỗi runtime. Bạn có thể tải lại để thử lại.
            </p>
            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  fontSize: '13px',
                  color: '#ffb3b3',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(231, 76, 60, 0.08)',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleRetry}
              style={{
                marginTop: '18px',
                padding: '12px 22px',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #4ecca3, #3498db)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Tải lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;