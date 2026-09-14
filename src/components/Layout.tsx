import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/", label: "Accueil", icon: "🏠", end: true },
  { to: "/hifz", label: "Hifz", icon: "📿", end: false },
  { to: "/quiz", label: "Quiz", icon: "❓", end: false },
  { to: "/reglages", label: "Réglages", icon: "⚙️", end: false },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navigation principale">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              "bottom-nav__item" + (isActive ? " bottom-nav__item--active" : "")
            }
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="bottom-nav__label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
