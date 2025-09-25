import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M17.75 3.25a.75.75 0 00-1.5 0V4.5h-8.5V3.25a.75.75 0 00-1.5 0V4.5A2.25 2.25 0 004 6.75v5.5a2.25 2.25 0 002.25 2.25h1.5a.75.75 0 01.75.75v2.25h-1.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-1.5V15a.75.75 0 01.75-.75h1.5A2.25 2.25 0 0020 12.25v-5.5A2.25 2.25 0 0017.75 4.5V3.25zM6.5 6.75c0-.414.336-.75.75-.75h9.5c.414 0 .75.336.75.75v5.5a.75.75 0 01-.75.75H7.25a.75.75 0 01-.75-.75v-5.5z"
      clipRule="evenodd"
    />
    <path d="M10.5 19.5a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0z" />
  </svg>
);

export default TrophyIcon;
