import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('HMDSI public page error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f4f0e6] px-6">
        <div className="max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0200B5] mb-3">
            Terjadi kendala
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#0a0a1a]">
            Halaman tidak dapat ditampilkan
          </h1>
          <p className="mt-4 text-[#0a0a1a]/60">
            Data halaman mungkin sedang tidak tersedia atau terjadi kesalahan sementara.
            Silakan coba lagi.
          </p>
          {import.meta.env.DEV && this.state.message && (
            <pre className="mt-6 p-4 text-left text-xs overflow-auto rounded-xl bg-black/5 text-[#0a0a1a]/70">
              {this.state.message}
            </pre>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="btn-editorial btn-editorial-primary"
            >
              Coba Lagi
            </button>
            <Link to="/" className="btn-editorial btn-editorial-outline">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
