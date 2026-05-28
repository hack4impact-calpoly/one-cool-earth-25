// components/Footer.tsx
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type FooterProps = {
  hasSignedWaiver: boolean;
};

export default function Footer({ hasSignedWaiver }: FooterProps) {
  return (
    <>
      {!hasSignedWaiver && (
        <section className="waiver-section">
          <h2>Sign our Volunteer Waiver Here:</h2>

          <div className="waiver-buttons">
            <a
              href="https://form.jotform.com/70895957565174"
              target="_blank"
              rel="noopener noreferrer"
              className="waiver-button"
            >
              English Waiver
            </a>

            <a
              href="https://form.jotform.com/251204962817155"
              target="_blank"
              rel="noopener noreferrer"
              className="waiver-button"
            >
              Spanish Waiver
            </a>
          </div>
        </section>
      )}

      <footer className="footer-wrap">
        <div className="footer">
          <div className="footer-left">
            <div className="socials">
              <a
                href="https://www.facebook.com/OneCoolEarth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/onecoolearth/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.linkedin.com/company/one-cool-earth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a href="mailto:action@onecoolearth.org" aria-label="Email">
                <MdEmail />
              </a>
            </div>

            <div className="contact-info">
              <p>
                <strong>Phone:</strong>
                <br />
                805-242-6301
              </p>

              <p>
                <strong>Email:</strong>
                <br />
                <strong>
                  <a href="mailto:action@onecoolearth.org">action@onecoolearth.org</a>
                </strong>
              </p>

              <p>
                <strong>Mailing Address:</strong>
                <br />
                P.O Box 150
                <br />
                San Luis Obispo CA 93406
              </p>

              <p className="copyright">© COPYRIGHT 2025. ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          <div className="footer-right">
            <div className="newsletter-card">
              <form
                action="https://app.us4.list-manage.com/subscribe/post?u=6c9598dd5f26c1970cb2e3a1f&id=f78c5159ed&f_id=00d96ceaf0"
                method="post"
                target="_blank"
              >
                <h2>Subscribe to our emails for OCE news and events!</h2>

                <p className="required-note">
                  <span>*</span> indicates required
                </p>

                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL">
                    Email Address <span>*</span>
                  </label>

                  <input type="email" name="EMAIL" id="mce-EMAIL" required />
                </div>

                <div className="mc-field-group">
                  <label htmlFor="mce-MMERGE13">Full Name</label>

                  <input type="text" name="MMERGE13" id="mce-MMERGE13" />
                </div>

                {/* bot protection */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-5000px",
                  }}
                >
                  <input type="text" name="b_6c9598dd5f26c1970cb2e3a1f_f78c5159ed" tabIndex={-1} defaultValue="" />
                </div>

                <div className="newsletter-footer">
                  <button type="submit">Subscribe</button>

                  <a href="http://eepurl.com/i3XPfE" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                      alt="Intuit Mailchimp"
                      className="mailchimp-logo"
                    />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
