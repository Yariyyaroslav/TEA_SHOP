import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTeaBySlug } from '../api/client';
import { formatCurrency } from '../hooks/useCurrency';
import { useCart } from '../store/CartContext';
import type { Tea } from '../types';

export function ProductPage() {
  const { slug = '' } = useParams();
  const [tea, setTea] = useState<Tea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchTeaBySlug(slug)
      .then(setTea)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="state">Завантаження товару…</p>;
  }

  if (error || !tea) {
    return (
      <div className="state-wrap">
        <p className="state error">{error || 'Товар не знайдено.'}</p>
        <Link to="/catalog">Повернутися в каталог</Link>
      </div>
    );
  }

  return (
    <article className="product-page">
      <img src={tea.image || '/images/tea-placeholder.svg'} alt={tea.name} />
      <div>
        <p className="category">{tea.category}</p>
        <h1>{tea.name}</h1>
        <p className="description">{tea.description}</p>
        <p className="price">{formatCurrency(tea.price)}</p>
        <button type="button" className="hero-btn" onClick={() => addToCart(tea)}>
          Додати в кошик
        </button>
      </div>
    </article>
  );
}
