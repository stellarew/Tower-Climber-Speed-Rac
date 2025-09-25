import React from 'react';

const ShoeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.25 8.25a.75.75 0 00-1.5 0v.255a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V8.25a.75.75 0 00-1.5 0v.255a3 3 0 003 3h4.5a3 3 0 003-3V8.25z" />
    <path
      fillRule="evenodd"
      d="M3 8.25a3 3 0 013-3h12a3 3 0 013 3v9a3 3 0 01-3 3H6a3 3 0 01-3-3v-9zm15 0a1.5 1.5 0 00-1.5-1.5H6A1.5 1.5 0 004.5 8.25v9A1.5 1.5 0 006 18.75h12A1.5 1.5 0 0019.5 17.25v-9z"
      clipRule="evenodd"
    />
  </svg>
);

export default ShoeIcon;
