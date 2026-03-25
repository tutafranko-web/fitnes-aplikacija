'use client';

import { forwardRef } from 'react';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: string;
  children: React.ReactNode;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(({ children, glow, className = '', style, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-fit-card rounded-[22px] p-[18px] border border-fit-border backdrop-blur-[20px] transition-all duration-[350ms] ${className}`}
    style={{
      boxShadow: glow ? `0 0 40px ${glow}22` : 'none',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
));

Box.displayName = 'Box';
export default Box;
