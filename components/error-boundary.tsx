'use client'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('[ErrorBoundary]', error, errorInfo) }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Algo sali\u00f3 mal</h1>
          <p className="text-muted-foreground mb-6">Ocurri\u00f3 un error inesperado.</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Recargar</button>
        </div>
      )
    }
    return this.props.children
  }
}
