import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-4 h-4' }) => {
  if (!name) return <HelpCircle className={className} />;

  // Try direct lookup
  const IconComponent = (LucideIcons as Record<string, any>)[name];

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return <HelpCircle className={className} />;
};
