import { Link } from 'react-router-dom';
import type { Tea } from '../types';
import { formatCurrency } from '../hooks/useCurrency';
import { useCart } from '../store/CartContext';

type ProductCardProps = {
  tea: Tea;
};

export function ProductCard({ tea }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${tea.slug}`}>
        <img src={tea.image || '/images/tea-placeholder.svg'} alt={tea.name} loading="lazy" />
      </Link>
      <div className="product-content">
        <p className="category">{tea.category}</p>
        <h3>{tea.name}</h3>
        <p className="description">{tea.description}</p>
        <div className="product-bottom">
          <strong>{formatCurrency(tea.price)}</strong>
          <button type="button" onClick={() => addToCart(tea)}>
            У кошик
          </button>
        </div>
      </div>
    </article>
  );
}
