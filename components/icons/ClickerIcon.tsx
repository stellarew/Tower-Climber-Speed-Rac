import React from 'react';

const ClickerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.5 1.5 0 00-2.2 2.585 1.5 1.5 0 002.601-1.626zM12 7.5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" />
    <path
      fillRule="evenodd"
      d="M16.5 7.5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75zM15 11.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM9 9.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V9.75z"
      clipRule="evenodd"
    />
    <path d="M1.5 13.125a.75.75 0 00-1.5 0v2.625a3 3 0 003 3h15a3 3 0 003-3V13.125a.75.75 0 00-1.5 0v2.625a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-2.625z" />
  </svg>
);

export default ClickerIcon;
