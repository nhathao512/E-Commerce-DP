import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./AdminPage.module.css";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme", !darkMode);
  };

  return (
    <div className={styles.headerMinimal}>
      <div className={styles.themeToggle} onClick={toggleTheme}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
      <img
        src="https://randomuser.me/api/portraits/men/75.jpg"
        alt="User Avatar"
        className={styles.userAvatar}
      />
    </div>
  );
};

export default Header;
