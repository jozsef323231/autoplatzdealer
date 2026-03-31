import React, { useEffect, useState, useContext } from "react";
import { LanguageCtx } from "../App.tsx";
import { useUser } from "../UserContext";
import SavedCarService from "../api/savedCarService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "../api/axiosInstance";
import { CarDTO } from "../Types";

interface SavedCarsModalProps {
    onClose: () => void;
}

const SavedCarsModal: React.FC<SavedCarsModalProps> = ({ onClose }) => {
    const { user } = useUser();
    const langCtx = useContext(LanguageCtx);
    const [savedCars, setSavedCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedCars = async () => {
            if (!user) return;

            setLoading(true);

            try {
                const userId = user.id;
                const fetchedCars = await SavedCarService.getSavedCarsByUser(userId);
                setSavedCars(fetchedCars);
            } catch (err) {
                console.error("Failed to fetch saved cars", err);
                {langCtx?.translate.savedCarsProblem};
            } finally {
                setLoading(false);
            }
        };

        fetchSavedCars();

        return () => {
            setLoading(false);
            setSavedCars([]);
        };
    }, [user]);

    const handleViewDetails = (car: any) => {
        onClose();
        navigate(`/Car-Details?carId=${car.id}`);
    };

    const handleRemoveCar = async (carId: any) => {
        if (!user) return;
        
        try {
            await SavedCarService.removeSavedCar(user.id, carId);
            // Update the state to remove the car from the list
            setSavedCars(savedCars.filter(car => car.id !== carId));
        } catch (err) {
            console.error("Failed to remove saved car", err);
            {langCtx?.translate.savedDeleteProblem};
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2 className="modal-title">{langCtx?.translate.savedCars || "Saved Cars"}</h2>
                </div>
                
                <div className="modal-content">
                    {loading ? (
                        <div className="empty-state">
                            <div className="loading-spinner">Loading...</div>
                        </div>
                    ) : savedCars.length === 0 ? (
                        <div className="empty-state">
                            <FontAwesomeIcon icon="heart" className="empty-state-icon" />
                            <p>{langCtx?.translate.noSavedCars || "You don't have any saved cars yet."}</p>
                        </div>
                    ) : (
                        savedCars.map((car) => (
                            <div key={car.id} className="saved-car-item">
                                {car.images && car.images.length > 0 && (
                                    <img 
                                        src={getBaseUrl() + car.images[0].url} 
                                        alt={`${car.brand.brandEnglish} ${car.carModel.modelNameEnglish}`} 
                                        className="saved-car-image" 
                                    />
                                )}
                                <div className="saved-car-info">
                                    <div className="saved-car-title">
                                        {car.brand.brandEnglish} {car.carModel.modelNameEnglish}
                                    </div>
                                    <div className="saved-car-price">
                                        {Number(car.price).toLocaleString()} Ft
                                    </div>
                                </div>
                                <div className="saved-car-actions">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleViewDetails(car)}
                                    >
                                        <FontAwesomeIcon icon="eye" /> {langCtx?.translate.view || "View"}
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleRemoveCar(car.id)}
                                    >
                                        <FontAwesomeIcon icon="trash-alt" /> {langCtx?.translate.remove || "Remove"}
                                    </button>
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
        </div>
    );
};

export default SavedCarsModal;