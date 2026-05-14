export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px' }}>
            Task Forge
          </div>
          <p>
            A next-generation project management platform built for teams who
            demand precision, clarity, and seamless collaboration.
          </p>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Navigation</div>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#philosophy">Philosophy</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Company</div>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Connect</div>
          <ul>
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        © {new Date().getFullYear()} Task Forge. All rights reserved.
      </div>
    </footer>
  );
}
