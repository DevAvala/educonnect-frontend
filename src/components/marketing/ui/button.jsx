import { LoaderCircle } from "lucide-react";
export function ButtonLink({ variant = "primary", className = "", children, ...props }) {
	return <a className={`button button--${variant} ${className}`} {...props}>
      {children}
    </a>;
}
export function Button({ variant = "primary", loading = false, className = "", children, disabled, ...props }) {
	return <button className={`button button--${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <LoaderCircle className="spinner" size={18} aria-hidden="true" />}
      {children}
    </button>;
}
