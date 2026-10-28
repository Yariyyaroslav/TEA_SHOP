import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="state-wrap">
      <h1>404</h1>
      <p className="state">Сторінку не знайдено.</p>
      <Link to="/">Повернутися на головну</Link>
    </section>
  );
}
