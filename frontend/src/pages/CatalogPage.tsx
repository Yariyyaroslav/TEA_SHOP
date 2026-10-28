import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchTeas } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import type { Tea } from '../types';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  const [teas, setTeas] = useState<Tea[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchTeas(category || undefined)
      .then(data => {
        setTeas(data.teas);
        setCategories(data.categories);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section>
      <h1>Каталог чаю</h1>
      <div className="category-list">
        <Link className={!category ? 'category-pill active' : 'category-pill'} to="/catalog">
          Усі категорії
        </Link>
        {categories.map(item => (
          <Link
            key={item}
            className={item === category ? 'category-pill active' : 'category-pill'}
            to={`/catalog?category=${encodeURIComponent(item)}`}
          >
            {item}
          </Link>
        ))}
      </div>

      {loading ? <p className="state">Завантаження товарів…</p> : null}
      {error ? <p className="state error">{error}</p> : null}
      {!loading && !error && !teas.length ? <p className="state">За обраним фільтром товари не знайдені.</p> : null}

      <div className="product-grid">
        {teas.map(tea => (
          <ProductCard key={tea._id} tea={tea} />
        ))}
      </div>
    </section>
  );
}
