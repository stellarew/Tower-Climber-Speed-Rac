import React from 'react';

const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.75 2.25a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V9a.75.75 0 001.5 0V6h2.25a.75.75 0 000-1.5H13.5V2.25z" />
    <path
      fillRule="evenodd"
      d="M3 10.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zM5.25 12A.75.75 0 016 11.25h12a.75.75 0 01.75.75v8.25a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12z"
      clipRule="evenodd"
    />
  </svg>
);

export default GiftIcon;
