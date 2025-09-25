import React from 'react';

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75zM9 19.5v-4.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5h2.25V3.75H6.75v15.75H9z"
      clipRule="evenodd"
    />
    <path d="M11.25 7.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-3z" />
  </svg>
);

export default SaveIcon;
