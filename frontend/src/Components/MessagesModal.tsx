import React, { useEffect, useState, useContext } from "react";
import { Message } from "../Interfaces/Message.ts";
import { LanguageCtx } from "../App.tsx";
import { useUser } from "../UserContext";
import {deleteMessage, getMessagesByUser} from "../api/messageService.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUser, faCalendarAlt, faExclamationCircle, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';

interface MessagesModalProps {
    onClose: () => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ onClose }) => {
    const { user } = useUser();
    const langCtx = useContext(LanguageCtx);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;

            setLoading(true);

            try {
                const fetchedMessages = await getMessagesByUser(user.id);
                setMessages(fetchedMessages);
            } catch (err) {
                console.error("Failed to fetch messages", err);
                {langCtx?.translate.fetchProblem}
                    
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        return () => {
            setLoading(false);
            setMessages([]);
            setError(null);
        };
    }, [user]);

    const handleDelete = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            // Update the messages list immediately
            setMessages(messages.filter(msg => msg.id !== messageId));
        } catch (err) {
            console.error("Failed to delete message", err);
            {langCtx?.translate.deleteProblem}
            
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2 className="modal-title">{langCtx?.translate.myMessages || "My Messages"}</h2>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="empty-state">
                            <div className="loading-spinner">Loading...</div>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <FontAwesomeIcon icon={faExclamationCircle} className="empty-state-icon" />
                            <p>{error}</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-state">
                            <FontAwesomeIcon icon={faEnvelopeOpen} className="empty-state-icon" />
                            <p>{langCtx?.translate.noMessage || "No messages found."}</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.date} className="message-item">
                                <div className="message-sender">
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                                    {"System"}
                                </div>
                                <div className="message-content">
                                    {msg.content}
                                </div>
                                <div className="message-date">
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} />
                                    {new Date(msg.date).toLocaleString()}
                                </div>
                                <div className="message-footer">
                                    <div className="message-actions">
                                        <button
                                            className="btn btn-sm btn-icon"
                                            onClick={() => handleDelete(msg.id)}
                                            title={langCtx?.translate.deleteMessage || "Delete Message"}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {langCtx?.translate.closed || "Close"}
                    </button>
                </div>
            </div>

            {/*{editingAppointment && (*/}
            {/*    <AppointmentEditModal*/}
            {/*        onClose={() => setEditingAppointment(null)}*/}
            {/*        onSave={(newDate) => {*/}
            {/*            // Pass the full UpdateReservationDTO including the reservation ID*/}
            {/*            handleAppointmentUpdate({*/}
            {/*                id: editingAppointment.id,*/}
            {/*                carId: editingAppointment.carId,*/}
            {/*                date: newDate*/}
            {/*            });*/}
            {/*            setEditingAppointment(null);*/}
            {/*        }}*/}
            {/*        currentDate={editingAppointment.date}*/}
            {/*        carId={editingAppointment.carId}*/}
            {/*        reservationId={editingAppointment.id} // Pass the reservation ID as well*/}
            {/*        t={t}*/}
            {/*    />*/}
            {/*)}*/}


        </div>
    );
};

export default MessagesModal;
