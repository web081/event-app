import React, { useEffect, useState } from "react";

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export const Alert = ({
  children,
  variant = "default",
  className = "",
  show: initialShow = true,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [show, setShow] = useState(initialShow);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  useEffect(() => {
    let timeoutId;
    if (show && autoClose) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, autoClose, autoCloseTime]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  const baseClasses =
    "fixed top-4 right-4 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-[480px] animate-slide-in-right z-50";
  const variantClasses = {
    default: "bg-blue-100 border-blue-300 text-blue-800",
    destructive: "bg-red-100 border-red-300 text-red-800",
    success: "bg-blue-100 border-bg-blue-100 text-grey-800",
    warning: "bg-yellow-700 border-yellow-800 text-yellow-800",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{children}</div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-black/5"
          aria-label="Close alert"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
