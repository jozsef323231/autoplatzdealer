import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LanguageCtx, MobileMenuContext } from '../App';
import { translations } from '../translations';
import LoginModal from './LoginModal';
import MessagesModal from "./MessagesModal";
import SavedCarsModal from "./SavedCarsModal";
import { useUser } from '../UserContext';
import {changePreferredLanguage} from "../api/userService.ts";


const Header = () => {
  const { user, isAuthenticated, logoutUser } = useUser();
  const langCtx = useContext(LanguageCtx);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const { toggleMenu } = useContext(MobileMenuContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showSavedCarsModal, setShowSavedCarsModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(langCtx?.language || "hu");

  // --- Scroll hide/show logic ---
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setShowNavbar(false); // scroll down, hide
          } else {
            setShowNavbar(true); // scroll up, show
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [lastScrollY]);

  // Update selectedLanguage when context language changes
  useEffect(() => {
    const updateLanguage = async () => {
      if (langCtx?.language) {
        setSelectedLanguage(langCtx.language);
        if (user) {
          await changePreferredLanguage(user.id, langCtx.language);
        }
      }
    };
    updateLanguage();
  }, [langCtx?.language, user]);

  // Add effect to update isLoggedIn when authentication state changes
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as "hu" | "en" | "de";
    setSelectedLanguage(newLanguage);
    if (langCtx && translations[newLanguage]) {
      langCtx.changeTranslate(translations[newLanguage] as any, newLanguage);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <header className={`header fancy-navbar${showNavbar ? " show" : " hide"}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <FontAwesomeIcon icon="car" className="logo-icon" />
            <span>Auto</span>Platz
          </Link>
        </div>

        {/* Hamburger menu button for mobile */}
        <button className="hamburger-menu" onClick={toggleMenu}>
          <FontAwesomeIcon icon="bars" />
        </button>

        {/* Desktop navigation */}
        <div className="desktop-nav">
          <div className="language-selector" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1.5rem'}}>
            <FontAwesomeIcon icon="language" className="language-icon" />
            <select
              onChange={handleLanguageChange}
              value={selectedLanguage}
              style={{margin: 0, padding: '0.3rem 1.2rem', minWidth: 80}}
            >
              <option value="hu">Magyar</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          {/* NAVIGATION: csak egyszer! */}

          <nav>
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">
                  <FontAwesomeIcon icon="home" /> {langCtx?.translate.homepage}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="nav-link">
                  <FontAwesomeIcon icon="car" /> {langCtx?.translate.cars}
                </Link>

              </li>
              <li>
                <Link to="/locations" className="nav-link">
                  <FontAwesomeIcon icon="location-dot" /> {langCtx?.translate.locations}
                </Link>
              </li>
            </ul>
          </nav>

          {isLoggedIn ? (
            <div className="profile-menu">
              <button className="profile-btn" onClick={toggleUserMenu}>
                <FontAwesomeIcon icon="user" /> {langCtx?.translate.myProfile}
              </button>
              {showUserMenu && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                      <FontAwesomeIcon icon="user" /> {langCtx?.translate.myData}
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => {
                      setShowSavedCarsModal(true);
                      setShowUserMenu(false);
                    }}>
                      <FontAwesomeIcon icon="heart" /> {langCtx?.translate.savedCars}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => {
                      setShowMessagesModal(true);
                      setShowUserMenu(false);
                    }}>
                      <FontAwesomeIcon icon="envelope" /> {langCtx?.translate.myMessages}
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <FontAwesomeIcon icon="sign-out-alt" /> {langCtx?.translate.logout}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowLoginModal(true)}>
              <FontAwesomeIcon icon="sign-in-alt" /> {langCtx?.translate.login}
            </button>
          )}
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          language={langCtx?.language || "hu"}
          t={langCtx?.translate || translations.hu}
        />
      )}
      {showMessagesModal && <MessagesModal onClose={() => setShowMessagesModal(false)} />}
      {showSavedCarsModal && <SavedCarsModal onClose={() => setShowSavedCarsModal(false)} />}
    </header>
  );
};

export default Header;
