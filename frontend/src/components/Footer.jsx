export default function Footer() {
  return (
    <footer className="deelance-footer">
      <div className="container-fluid px-4 py-5">
        <div className="row gy-4">
          {/* LEFT - BRAND + ABOUT */}
          <div className="col-12 col-lg-5">
            <div className="footer-brand">
              <span className="footer-logo">DeeLance</span>
            </div>

            <p className="footer-desc">
              DeeLance is a secure freelancer platform built to connect talent
              with real clients. We focus on privacy, smooth collaboration, and
              fast project delivery.
            </p>
          </div>

          {/* CENTER - LINKS */}
          <div className="col-12 col-lg-3">
            <h6 className="footer-title">Powered by</h6>
            <ul className="footer-list">
              <li>DeeLance Core</li>
              <li>Blog</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* RIGHT - CREATORS */}
          <div className="col-12 col-lg-4">
            <h6 className="footer-title">Creators</h6>
            <ul className="footer-list">
              <li>Yash</li>
              <li>Aradhya</li>
              <li>Ishant</li>
              <li>Ayush</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LINE */}
        <div className="footer-bottom text-center mt-5">
          © 2026 DeeLance • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
