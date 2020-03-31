import React, { useEffect, useState } from 'react';

type Props = {
  children: any;
};

const ClientOnly = ({ children }: Props) => {
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => setIsComponentMounted(true), []);

  if (!isComponentMounted) {
    return <div/>;
  }

  return children;
};

export default ClientOnly;
