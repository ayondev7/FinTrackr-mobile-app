import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
  icon?: React.ReactNode;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, color, icon }) => {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: `${color}20` }}
    >
      {icon && <span style={{ color }}>{icon}</span>}
      <span className="text-sm font-semibold" style={{ color }}>
        {name}
      </span>
    </div>
  );
};
