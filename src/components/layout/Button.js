import React from 'react';

export default function Button({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
