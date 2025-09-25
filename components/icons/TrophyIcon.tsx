import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path 
      d="M18.5 2.25a.75.75 0 00-1.06 0L12 7.69 6.56 2.25a.75.75 0 00-1.06 1.06L10.94 9 5.5 14.44a.75.75 0 001.06 1.06L12 10.06l5.44 5.44a.75.75 0 001.06-1.06L13.06 9l5.44-5.69a.75.75 0 000-1.06zM21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0zM12 20.25a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" 
    />
  </svg>
);

export default TrophyIcon;
