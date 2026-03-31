import React, { useContext, useState, useEffect } from "react";
import { useUser } from "../UserContext.tsx"; // Import the custom hook
import { LanguageCtx } from "../App";
import { UserDTO } from "../Interfaces/User.ts";
import { ReservationDTO } from "../Interfaces/Reservation.ts";
import PasswordChangeModal from "../Components/PasswordChangeModal"; // Import the new component
import ReservationService from "../api/reservationService.ts";

function Profile({ showNotification }: { showNotification: (msg: string, type?: string) => void }) {
  const { user, isAuthenticated, registerUser } = useUser(); // Consume user context
  const langCtx = useContext(LanguageCtx); // Access language context

  // Initialize state with user data from context, or use default values
  const [name, setName] = useState<string>(user?.name || "Test User");
  const [email, setEmail] = useState<string>(user?.email || "testuser@example.com");
  const [phone, setPhone] = useState<string>(user?.phoneNumber || "+36 30 123 4567");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false); // New state for modal visibility
  const [reservations, setReservations] = useState<ReservationDTO[]>([]); // State for reservations
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  // Update the state with user data whenever the user context changes
  useEffect(() => {
    if (user) {
      setName(user.name || "Test User");
      setEmail(user.email || "testuser@example.com");
      setPhone(user.phoneNumber || "+36 30 123 4567");
    }
  }, [user]);

  // Load reservations
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservationsData = await ReservationService.getAllReservations();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error loading reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadReservations();
    }
  }, [isAuthenticated]);

  // Display a message if the user is not authenticated
  if (!isAuthenticated) {
    return <p>{langCtx?.translate.loginForData}</p>; // Show message if not logged in
  }

  // Handle form submission to update user data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assuming you want to update user data through a registerUser or similar method
    // In practice, you might call an API to update user data
    const updatedUser: UserDTO = {
      ...user!,
      name,
      email,
      phoneNumber: phone,
    };

    // Update user in context (you might use a different function to update the server if necessary)
    registerUser(updatedUser as any).then(() => {
      showNotification("Your data has been saved!", "success");
    }).catch((error) => {
      console.error("Error saving user data:", error);
      showNotification(langCtx?.translate.errorOccurred || "Error occurred while saving data", "error");
    });
  };

  // Toggle password change modal
  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  // Handle reservation cancellation
  const handleCancelReservation = async (id: number) => {
    if (!window.confirm(langCtx?.translate.deleteMessage || "Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      await ReservationService.deleteReservation(id.toString());
      setReservations(reservations.filter(res => res.id !== id));
      showNotification(langCtx?.translate.cancel || "Reservation cancelled successfully!", "success");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      showNotification(langCtx?.translate.errorOccurred || "Error occurred while cancelling reservation", "error");
    }
  };

  return (
      <main>
        <div className="container">
          <h2>{langCtx?.translate.myData}</h2>
          <form id="edit-profile" onSubmit={handleSubmit}>
            <label htmlFor="name">{langCtx?.translate.name}</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email">{langCtx?.translate.email}</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="phone">{langCtx?.translate.phoneNumber}</label>
            <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button type="submit" className="btn">
              {langCtx?.translate.save}
            </button>
          </form>
          
          {/* Add password change button */}
          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={togglePasswordModal} 
              className="btn btn-secondary"
            >
              {langCtx?.translate.changePassword || "Jelszó módosítása"}
            </button>
          </div>

          {showPasswordModal && user?.id && (
            <PasswordChangeModal
              onClose={togglePasswordModal}
              t={langCtx?.translate || {}}
              userId={user.id}
              showNotification={showNotification}
            />
          )}

          {/* Reservations Section */}
          <div style={{ marginTop: '2rem' }}>
            <h3>{langCtx?.translate.appointment || "Appointments"}</h3>
            {loading ? (
              <p>{langCtx?.translate.loading || "Loading..."}</p>
            ) : reservations.length === 0 ? (
              <p>{langCtx?.translate.noMessage || "No reservations"}</p>
            ) : (
              <div className="reservations-list">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="reservation-item" style={{
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <p><strong>{langCtx?.translate.appointmentDate || "Date"}:</strong> {new Date(reservation.date).toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="btn btn-cancel"
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {langCtx?.translate.cancel || "Cancel"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
  );
}

export default Profile;