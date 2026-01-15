export const Button = ({ children, ...props }) => (
  <button className="custom-button" {...props}>
    {children}
  </button>
);
