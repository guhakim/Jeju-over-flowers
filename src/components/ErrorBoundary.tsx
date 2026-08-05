import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // 이 프로젝트엔 @types/react가 없어 Component가 any로 해석되고, extends any인
  // 클래스는 상속 멤버(props/state)를 자동으로 갖지 못한다. 타입만 명시해서 알려준다.
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfbfa] text-[#1b1c19] px-6 text-center gap-4">
          <h1 className="font-display font-extrabold text-2xl text-[#006067]">일시적인 오류가 발생했어요</h1>
          <p className="text-sm text-[#5c6869] font-semibold max-w-sm">
            화면을 표시하는 중 문제가 생겼습니다. 새로고침하면 대부분 정상적으로 복구됩니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-3 bg-[#006067] text-white rounded-2xl font-display font-extrabold text-sm hover:bg-[#007b83] transition-all active:scale-95"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
