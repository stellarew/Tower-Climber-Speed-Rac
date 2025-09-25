import React from 'react';

const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path 
      fillRule="evenodd" 
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 8.25a.75.75 0 00-1.5 0v1.5H10.5a.75.75 0 000 1.5h.75v2.25a.75.75 0 001.5 0v-2.25h.75a.75.75 0 000-1.5h-.75V8.25z" 
      clipRule="evenodd" 
    />
    <path d="M9.013 12c0-.938.626-1.5 1.487-1.5h.025c.861 0 1.487.562 1.487 1.5h.025c0-.938.626-1.5 1.488-1.5h.025c.86 0 1.487.562 1.487 1.5v.013c0 .937-.626 1.5-1.487 1.5h-.025c-.861 0-1.488-.563-1.488-1.5h-.025c0 .938-.626 1.5-1.488 1.5h-.025c-.86 0-1.487-.563-1.487-1.5V12z" />
  </svg>
);

export default CoinIcon;
