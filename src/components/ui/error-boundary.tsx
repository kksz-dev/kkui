import * as React from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorBoundaryFallbackProps {
  error: Error;
  /** Component stack from React, when it supplied one. */
  componentStack?: string;
  /** Clear the error and re-render the children. */
  reset: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Replace the built-in panel. */
  fallback?: React.ReactNode | ((props: ErrorBoundaryFallbackProps) => React.ReactNode);
  /** Report the failure — logging, Sentry, a toast. */
  onError?: (error: Error, info: { componentStack?: string }) => void;
  /** Called after a successful reset. */
  onReset?: () => void;
  /** Any change to a value here clears the error, e.g. the current route. */
  resetKeys?: unknown[];
  /** Show the message and stack in the default panel. Defaults to DEV only. */
  showDetails?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  retryText?: React.ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
  componentStack?: string;
  /** resetKeys as they were when the error was caught. */
  keysAtError?: unknown[];
}

function changed(a: unknown[] = [], b: unknown[] = []) {
  return a.length !== b.length || a.some((value, i) => !Object.is(value, b[i]));
}

/**
 * Catches a render error in its subtree and shows something other than a blank
 * page. React only surfaces these to class components, so this one stays a class.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // snapshot the keys as they are now: the render that threw usually changed
    // them too, and comparing against the previous props would clear the error
    // in the very next commit, before anyone saw the fallback
    this.setState({ componentStack: info.componentStack ?? undefined, keysAtError: this.props.resetKeys ?? [] });
    this.props.onError?.(error, { componentStack: info.componentStack ?? undefined });
  }

  componentDidUpdate() {
    const { error, keysAtError } = this.state;
    // `keysAtError` is only set once componentDidCatch has run; comparing before
    // that would reset on the very commit that rendered the fallback
    if (!error || keysAtError === undefined) return;
    // a later route change (or any other reset key) clears the error on its own
    if (changed(keysAtError, this.props.resetKeys)) this.reset();
  }

  reset = () => {
    this.setState({ error: null, componentStack: undefined, keysAtError: undefined });
    this.props.onReset?.();
  };

  render() {
    const { error, componentStack } = this.state;
    const {
      children,
      fallback,
      title = "Something went wrong",
      description = "This section failed to render. The rest of the page is unaffected.",
      retryText = "Try again",
      showDetails = import.meta.env?.DEV ?? false,
      className,
    } = this.props;

    if (!error) return children;

    if (typeof fallback === "function") return <>{fallback({ error, componentStack, reset: this.reset })}</>;
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <div
        data-slot="error-boundary"
        role="alert"
        className={cn(
          "flex flex-col items-start gap-3 rounded-xl border border-error/40 bg-error-bg/40 p-5 text-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2 font-medium text-text-heading">
          <TriangleAlert className="size-4 text-error" />
          {title}
        </div>

        <p className="text-text-secondary">{description}</p>

        {showDetails && (
          <pre className="kk-scrollbar max-h-48 w-full overflow-auto rounded-lg bg-bg-container p-3 font-mono text-xs text-text-secondary">
            {error.message}
            {componentStack ? `\n${componentStack}` : ""}
          </pre>
        )}

        <Button size="sm" onClick={this.reset} icon={<RotateCcw className="size-3.5" />}>
          {retryText}
        </Button>
      </div>
    );
  }
}

/** Wrap a component in a boundary once, instead of at every call site. */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  boundaryProps?: Omit<ErrorBoundaryProps, "children">,
): React.ComponentType<P> {
  const Wrapped = (props: P) => (
    <ErrorBoundary {...boundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  Wrapped.displayName = `withErrorBoundary(${Component.displayName ?? Component.name ?? "Component"})`;
  return Wrapped;
}
