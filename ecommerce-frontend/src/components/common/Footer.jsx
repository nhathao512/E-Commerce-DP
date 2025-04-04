// Footer.jsx
import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>Ecommerce App</h3>
          <p>© 2025 Ecommerce App. All rights reserved.</p>
          <p>Designed with my team</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.title}>Contact Us</h3>
          <p>Email: 522H0038@student.tdtu.edu.vn</p>
          <p>Phone: +84 329 545 212</p>
          <p>Address: 19 Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.title}>Quick Links</h3>
          <ul className={styles.links}>
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.title}>Follow Us</h3>
          <div className={styles.social}>
            <a href="https://facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://instagram.com">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;