import { NavLink } from 'react-router-dom';

export default function NavigationItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/projects'}
      className={({ isActive }) => `
        flex items-center gap-3 rounded-lg px-3 py-2.5
        text-sm font-medium transition-colors duration-200
        ${
          isActive
            ? 'bg-primary-soft text-primary'
            : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
        }
      `}
    >
      <Icon size={19} strokeWidth={1.8} />

      <span>{item.label}</span>
    </NavLink>
  );
}
