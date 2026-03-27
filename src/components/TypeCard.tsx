type TypeCardProps = {
  name: string;
  jp: string;
  cn: string;
  color: string;
  icon: string;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
};

function TypeCard({ name, jp, cn, color, icon, className = '', onClick, isSelected = false }: TypeCardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={`${color} flex h-full w-full flex-col items-center gap-2 rounded-xl p-6 text-center outline-2 outline-black transition-transform transition-opacity dark:outline-white ${onClick ? 'hover:scale-105' : ''} ${isSelected ? 'ring-4 ring-black dark:ring-white opacity-100' : ''} ${className}`.trim()}
    >
      <div className="w-16 h-16">
        <img src={icon} alt={`${name} type icon`} className="h-full w-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-extrabold tracking-tight">{name}</span>
        <span className="text-xs opacity-50">{cn}</span>
        <span className="text-xs opacity-50">{jp}</span>
      </div>
    </Component>
  );
}

export default TypeCard;
