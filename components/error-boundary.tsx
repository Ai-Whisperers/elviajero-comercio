'use client'
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback || <div className="p-8 text-center"><h2 className="text-xl font-bold">Algo salió mal</h2><p className="text-gray-500">Recargá la página o intentá de nuevo.</p></div>
    return this.props.children
  }
}
