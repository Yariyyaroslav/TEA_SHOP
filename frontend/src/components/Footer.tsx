const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>© {currentYear} Теплий лист. Чай для затишних моментів.</p>
      </div>
    </footer>
  );
}
