import React from "react";
import styles from "./Notification.module.css";

export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = "info", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}> 
      <span>{message}</span>
      <button className={styles.close} onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;
