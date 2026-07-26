import React from 'react';
import { MapPin } from 'lucide-react';

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}


export const BrandMark: React.FC<BrandMarkProps> = ({
  className = '',
  iconClassName = 'w-5 h-6 text-brand',
  textClassName = 'font-bold text-lg text-brand',
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <MapPin className={iconClassName} aria-hidden="true" />
    <span className={textClassName}>LSG Track</span>
  </div>
);
