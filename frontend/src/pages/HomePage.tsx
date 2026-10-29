import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTeas } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import type { Tea } from '../types';

export function HomePage() {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeas()
      .then(data => {
        setTeas(data.teas);
        setCategories(data.categories);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => teas.filter(tea => tea.featured).slice(0, 3), [teas]);

  return (
    <>
      <section className="hero">
        <div>
          <h1>Натуральний чай для щоденного ритуалу</h1>
          <p>
            Обирайте добірні сорти чаю: від класичного чорного до ароматного улуна.
            Швидке замовлення та доставка по Україні.
          </p>
          <Link className="hero-btn" to="/catalog">
            Перейти до каталогу
          </Link>
        </div>
        <img src="/images/tea-placeholder.svg" alt="Чайний набір" />
      </section>

      <section className="section-gap">
        <div className="section-heading">
          <h2>Найди свій настрій</h2>
          <span className="category">Добірка для тебе</span>
        </div>
        <div className="category-list">
          {categories.map(category => (
            <Link key={category} className="category-pill" to={`/catalog?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-gap">
        <div className="section-heading">
          <h2>Улюбленці гостей</h2>
          <Link to="/catalog" className="category-pill">Дивитись усі →</Link>
        </div>
        {loading ? <p className="state">Завантаження товарів…</p> : null}
        {error ? <p className="state error">{error}</p> : null}
        {!loading && !error && !featured.length ? <p className="state">Поки що немає товарів.</p> : null}
        <div className="product-grid">
          {featured.map(tea => (
            <ProductCard key={tea._id} tea={tea} />
          ))}
        </div>
      </section>
    </>
  );
}
