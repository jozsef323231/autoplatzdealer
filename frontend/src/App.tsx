import { createContext, useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import MobileMenu from "./Components/MobileMenu";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Cars from "./Pages/Cars";
import CarDetails from "./Pages/CarDetails";
import Profile from "./Pages/Profile";
import { translations, TranslationType } from "./translations";
import { UserProvider } from "./UserContext";

// Import icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faCar, faHome, faUser, faSearch, faTachometerAlt, faGasPump, 
  faCalendarAlt, faMap, faAngleDown, faAngleRight, faBars, faTimes,
  faEnvelope, faHeart, faSignOutAlt, faSignInAlt, faLanguage,
  faChevronLeft, faChevronRight, faMapMarkerAlt, faCalendarCheck,
  faCalendarPlus, faCheckCircle, faExclamationCircle, faSpinner,
  faCogs, faArrowLeft, faImage
} from '@fortawesome/free-solid-svg-icons';
import LocationsPage from "./Pages/LocationPage.tsx";
import Terms from "./Pages/Terms.tsx";
import ScrollToTop from "./Components/ScrollToTop.tsx";

import Notification, { NotificationType } from "./Components/Notification";

// Add icons to library
library.add(
  faCar, faHome, faUser, faSearch, faTachometerAlt, faGasPump,
  faCalendarAlt, faMap, faAngleDown, faAngleRight, faBars, faTimes,
  faEnvelope, faHeart, faSignOutAlt, faSignInAlt, faLanguage,
  faChevronLeft, faChevronRight, faMapMarkerAlt, faCalendarCheck, 
  faCalendarPlus, faCheckCircle, faExclamationCircle, faSpinner,
  faCogs, faArrowLeft, faImage
);

export const LanguageCtx = createContext<
    {
      translate: TranslationType;
      changeTranslate: (translate: TranslationType, newLanguage: "hu" | "en" | "de") => void;
      language: "hu" | "en" | "de";
    } | undefined
>(undefined);


// Context for managing mobile menu state
export const MobileMenuContext = createContext<{
  isMenuOpen: boolean;
  toggleMenu: () => void;
}>({
  isMenuOpen: false,
  toggleMenu: () => {},
});

function App() {
  const [language, setLanguage] = useState<"hu" | "en" | "de">("hu");
  const [translate, setTranslate] = useState<TranslationType>(translations.hu);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type?: NotificationType } | null>(null);
  const showNotification = (message: string, type?: NotificationType | string) => {
    setNotification({ message, type: (type as NotificationType) || "info" });
  };
  const closeNotification = () => setNotification(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const changeTranslate = (translate: TranslationType, newLanguage: "hu" | "en" | "de") => {
    setTranslate(translate);
    setLanguage(newLanguage);  // This updates the language
  };


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <UserProvider>
      <LanguageCtx.Provider value={{ translate, changeTranslate, language }}>
        <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
          <BrowserRouter>
            <ScrollToTop />
            <div className="app-container">
              <Header />

              {isMobile && <MobileMenu />}
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home language={language} showNotification={showNotification} />} />
                  <Route path="/cars" element={<Cars showNotification={showNotification} />} />
                  <Route path="/Car-Details" element={<CarDetails showNotification={showNotification} />} />
                  <Route path="/profile" element={<Profile showNotification={showNotification} />} />
                  <Route path="/locations" element={<LocationsPage showNotification={showNotification} />} />
                  <Route path="/terms" element={<Terms />} />
                </Routes>
              </main>
              <Footer />
              {notification && (
                <Notification
                  message={notification.message}
                  type={notification.type}
                  onClose={closeNotification}
                />
              )}
            </div>
          </BrowserRouter>
        </MobileMenuContext.Provider>
      </LanguageCtx.Provider>
    </UserProvider>
  );
}

export default App;
