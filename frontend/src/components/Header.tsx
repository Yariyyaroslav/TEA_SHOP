import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../store/CartContext';

const navItems = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/checkout', label: 'Оформлення' }
];

export function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">🫖</span>
          Теплий лист
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Відкрити меню"
          onClick={() => setMenuOpen(open => !open)}
        >
          ☰
        </button>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active cart-link' : 'cart-link')} onClick={() => setMenuOpen(false)}>
            Кошик <span>{totalItems}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
