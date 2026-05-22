import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer({ hasSignedWaiver = false }) {
  return (
    <>
      {/* waiver footer */}
      {!hasSignedWaiver && (
        <section className="waiver-section">
          <h2>Sign our Volunteer Waiver Here:</h2>

          <div className="waiver-buttons">
            <button>ENGLISH WAIVER</button>
            <button>SPANISH WAIVER</button>
          </div>
        </section>
      )}

      {/* general footer */}
      <footer className="footer">
        <div className="footer-left">
          <div className="socials">
            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />
            <MdEmail />
          </div>

          <div className="contact-info">
            <p>
              <strong>Phone:</strong>
            </p>
            <p>805-242-6301</p>

            <p>
              <strong>Email:</strong>
            </p>
            <p>
              <a href="mailto:action@onecoolearth.org">action@onecoolearth.org</a>
            </p>

            <p>
              <strong>Mailing Address:</strong>
            </p>
            <p>P.O Box 150</p>
            <p>San Luis Obispo CA 93406</p>
          </div>

          <p className="copyright">© COPYRIGHT 2025. ALL RIGHTS RESERVED.</p>
        </div>

        <div className="footer-right">
          <div className="newsletter-card">
            <h3>Subscribe to our emails for OCE news and events!</h3>

            <form>
              <label>Email Address *</label>
              <input type="email" />

              <label>Full Name</label>
              <input type="text" />

              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>
    </>
  );
}
