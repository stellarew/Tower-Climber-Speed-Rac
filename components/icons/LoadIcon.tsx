import React from 'react';

const LoadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.5a.75.75 0 00-.75.75v4.5l1.903-1.903a5.997 5.997 0 00-9.945 2.587.75.75 0 01-1.476-.424z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.5a.75.75 0 00.75-.75v-4.5l-1.903 1.903a5.997 5.997 0 009.945-2.587.75.75 0 011.476.424z"
        clipRule="evenodd"
      />
    </svg>
);
export default LoadIcon;
