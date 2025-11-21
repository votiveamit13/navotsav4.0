const LoaderButton = ({ loading, children, className, ...props }) => (
  <button
    {...props}
    className={`btn ${className}`}
    disabled={loading || props.disabled}
  >
    {loading ? (
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
      ></span>
    ) : null}
    {children}
  </button>
);

export default LoaderButton;