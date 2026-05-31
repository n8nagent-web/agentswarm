import { NavLink } from 'react-router-dom';
import { Home, UserCheck, Zap, Lightbulb, MessageSquare, FileText } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Introduction' },
    { path: '/front-desk-assistant', icon: UserCheck, label: 'Front Desk Assistant' },
    { path: '/speed-to-lead-assistant', icon: Zap, label: 'Speed to Lead Assistant' },
    { path: '/lead-generation-assistant', icon: Lightbulb, label: 'Lead Generation Assistant' },
    { path: '/outbound-chatbot', icon: MessageSquare, label: 'Outbound Chatbot' },
    { path: '/doc-magic', icon: FileText, label: 'Doc Magic' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          Assistant Dashboard
        </h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sidebar-foreground no-underline group ${
                      isActive
                        ? 'bg-nav-active text-white border-l-4 border-nav-active-border'
                        : 'hover:bg-nav-hover'
                    }`
                  }
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;