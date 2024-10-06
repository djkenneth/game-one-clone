import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const containerStyle = cva('container max-w-7xl mx-auto 2xl:max-w-[80%]');

const Container: React.FC<ContainerProps> = ({ className, ...props }) => {
  return <div className={cn(containerStyle(), className)} {...props} />;
};

export default Container;
