import React from 'react';
import CustomCursor from './CustomCursor';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <CustomCursor />
      {children}
    </div>
  );
};

export default Layout;
