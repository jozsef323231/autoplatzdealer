import React, { useState } from "react";
import styles from "./LoginModal.module.css";
import { useUser } from "../UserContext";


interface LoginModalProps {
  onClose: () => void;
  t: { [key: string]: string };
  language: "hu" | "en" | "de";
  showNotification?: (msg: string, type?: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, t, language, showNotification }) => {
  const { loginUser, registerUser } = useUser();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Map frontend language to backend accepted values (en, hu, jp)
  const getBackendLanguage = () => {
    if (language === 'hu') return 'hu';
    if (language === 'de' || language === 'en') return 'en';
    return 'en';
  };
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userName: "",
    phoneNumber: "",
    preferredLanguage: getBackendLanguage(),
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };


  // Password validation for registration
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push(t.passwordTooShort || "Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password)) errors.push(t.passwordUppercase || "Password must contain an uppercase letter.");
    if (!/[a-z]/.test(password)) errors.push(t.passwordLowercase || "Password must contain a lowercase letter.");
    if (!/[0-9]/.test(password)) errors.push(t.passwordDigit || "Password must contain a digit.");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push(t.passwordSpecial || "Password must contain a special character.");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (isRegisterMode) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        setErrorMessage(passwordErrors.join(" "));
        if (showNotification) showNotification(passwordErrors.join(" "), "error");
        return;
      }
      try {
        console.log("Sending registration data:", formData);
        await registerUser(formData);
        if (showNotification) showNotification(t.registrationSuccess || "Registration successful!", "success");
        setIsRegisterMode(false);
        // Clear form after successful registration
        setFormData({ email: "", password: "", name: "", userName: "", phoneNumber: "", preferredLanguage: getBackendLanguage() });
      } catch (error: any) {
        console.error("Registration error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        const errorMsg = error.response?.data?.message || error.response?.data || t.registrationFailed || "Registration failed. Please try again.";
        setErrorMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        if (showNotification) showNotification(typeof errorMsg === 'string' ? errorMsg : "Registration failed", "error");
      }
    } else {
      try {
        await loginUser(formData.email, formData.password);
        if (showNotification) showNotification(t.loginSuccess || "Login successful!", "success");
        onClose();
      } catch (error) {
        const errorMsg = t.loginProblem || "Login failed. Please check your credentials.";
        setErrorMessage(errorMsg);
        if (showNotification) showNotification(errorMsg, "error");
      }
    }
  };

  return (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-container"]}>
          <button className={styles["modal-close"]} onClick={onClose}>&times;</button>
          <h2>{isRegisterMode ? t.registerTitle : t.loginTitle}</h2>

          {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}

          <form onSubmit={handleSubmit} className={styles["modal-form"]}>
            {isRegisterMode && (
                <>
                  <label htmlFor="name">{t.name}:</label>
                  <input type="text" id="name" required value={formData.name} onChange={handleChange} />

                  <label htmlFor="userName">{t.username}:</label>
                  <input type="text" id="userName" required value={formData.userName} onChange={handleChange} />

                  <label htmlFor="phoneNumber">{t.phoneNumber}:</label>
                  <input type="tel" id="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} />
                </>
            )}

            <label htmlFor="email">{t.email}:</label>
            <input type="email" id="email" required value={formData.email} onChange={handleChange} />

            <label htmlFor="password">{t.password}:</label>
            <input type="password" id="password" required value={formData.password} onChange={handleChange} />

            <button type="submit" className={styles["btn"]}>
              {isRegisterMode ? t.register : t.login}
            </button>
          </form>

          <button className={styles["toggle-button"]} onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? t.switchToLogin : t.switchToRegister}
          </button>
        </div>
      </div>
  );
};

export default LoginModal;
