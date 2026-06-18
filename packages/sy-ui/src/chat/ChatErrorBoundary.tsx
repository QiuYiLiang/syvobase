import { Component, ReactNode } from 'react'

export interface ChatErrorBoundaryProps {
  children?: ReactNode
}
export class ChatErrorBoundary extends Component<
  ChatErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      console.error(this.state.error)
      return null
    }

    return this.props.children
  }
}
