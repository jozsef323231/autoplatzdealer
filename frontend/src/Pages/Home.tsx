import React, { useContext, useState, useEffect } from "react";
const LoginModal = React.lazy(() => import("../Components/LoginModal"));
import "../styles.css";
import { useNavigate } from "react-router-dom";
import { LanguageCtx } from "../App";
import { getAllMakerTypes, getAllModelsTypes, getAllBodyTypes, getAllTransmissionTypes, getAllFuelTypes, getAllColors, getAllDrivetrainTypes } from "../api/carMetadataService.ts";
import { BodyTypeDTO, CarMakerDTO, CarModelDTO, ColorDTO, DrivetrainTypeDTO, FuelTypeDTO } from "../Types";
import { CarDTO } from "../Types";
import { getCars } from "../api/carService.ts";
import { getBaseUrl } from "../api/axiosInstance.ts";

function Home({ language, showNotification }: { language: "hu" | "en" | "de"; showNotification: (msg: string, type?: string) => void }) {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
  const [bodyTypeOptions, setBodyTypeOptions] = useState<BodyTypeDTO[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<FuelTypeDTO[]>([]);
  const [colorTypeOptions, setColorTypeOptions] = useState<ColorDTO[]>([]);
  const [drivetrainTypeOptions, setDrivetrainTypeOptions] = useState<DrivetrainTypeDTO[]>([]);
  const [makerTypeOptions, setMakerTypeOptions] = useState<CarMakerDTO[]>([]);
  const [modelTypeOptions, setModelTypeOptions] = useState<CarModelDTO[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [filteredModels, setFilteredModels] = useState<CarModelDTO[]>([]);
  const [carCountByBrand, setCarCountByBrand] = useState<{[key: number]: number}>({});
  const [carCountByModel, setCarCountByModel] = useState<{[key: number]: number}>({});
  const [carCountByBodyTypeAndModel, setCarCountByBodyTypeAndModel] = useState<{[key: string]: number}>({});
  const [carCountByFuelTotal, setCarCountByFuelTotal] = useState<{[key: number]: number}>({});
  const [carCountByModelBodyFuel, setCarCountByModelBodyFuel] = useState<{[key: string]: number}>({});

  const langCtx = useContext(LanguageCtx);

  useEffect(() => {
    async function fetchStuff() {
      const respBody = await getAllBodyTypes();
      setBodyTypeOptions(respBody);
      const respFuel = await getAllFuelTypes();
      setFuelTypeOptions(respFuel);
      // getAllTransmissionTypes is called but not stored
      await getAllTransmissionTypes();
      const respColor = await getAllColors();
      setColorTypeOptions(respColor);
      const respDrivetrain = await getAllDrivetrainTypes();
      setDrivetrainTypeOptions(respDrivetrain);
      const respMaker = await getAllMakerTypes();
      setMakerTypeOptions(respMaker);
      const respModel = await getAllModelsTypes();
      setModelTypeOptions(respModel);
      const cars = await getCars();
      setCars(cars);
      
      // Számold meg az autókat márkánként
      const countByBrand: {[key: number]: number} = {};
      const countByModel: {[key: number]: number} = {};
      const countByBodyTypeAndModel: {[key: string]: number} = {};
      const countByFuelAndModelBody: {[key: string]: number} = {};
      const countByFuelTotal: {[key: number]: number} = {};
      
      cars.forEach(car => {
        const brandId = car.brand.id;
        countByBrand[brandId] = (countByBrand[brandId] || 0) + 1;
        
        const modelId = car.carModel.id;
        countByModel[modelId] = (countByModel[modelId] || 0) + 1;
        
        const key = `${car.carModel.id}_${car.bodyType.id}`;
        countByBodyTypeAndModel[key] = (countByBodyTypeAndModel[key] || 0) + 1;
        // fuel counts
        const fuelKey = `${car.carModel.id}_${car.bodyType.id}_${car.fuelType.id}`;
        countByFuelAndModelBody[fuelKey] = (countByFuelAndModelBody[fuelKey] || 0) + 1;
        countByFuelTotal[car.fuelType.id] = (countByFuelTotal[car.fuelType.id] || 0) + 1;
      });
      
      setCarCountByBrand(countByBrand);
      setCarCountByModel(countByModel);
      setCarCountByBodyTypeAndModel(countByBodyTypeAndModel);
      setCarCountByFuelTotal(countByFuelTotal);
      setCarCountByModelBodyFuel(countByFuelAndModelBody);
      console.log(cars);
    }
    fetchStuff();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const filtered = modelTypeOptions.filter(model => model.maker.id === parseInt(selectedBrand));
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
  }, [selectedBrand, modelTypeOptions]);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    // Brand
    if (selectedBrand) queryParams.set("brand", selectedBrand);

    // Model
    const modelSelect = document.getElementById("model-type") as HTMLSelectElement;
    if (modelSelect && modelSelect.value) queryParams.set("model", modelSelect.value);

    // Body Type
    const bodyTypeSelect = document.getElementById("body-type") as HTMLSelectElement;
    if (bodyTypeSelect && bodyTypeSelect.value) queryParams.set("bodyType", bodyTypeSelect.value);

    // Fuel Type
    const fuelTypeSelect = document.getElementById("fuel-type") as HTMLSelectElement;
    if (fuelTypeSelect && fuelTypeSelect.value) queryParams.set("fuelType", fuelTypeSelect.value);

    // Drivetrain Type
    const drivetrainTypeSelect = document.getElementById("drivetrain-type") as HTMLSelectElement;
    if (drivetrainTypeSelect && drivetrainTypeSelect.value) queryParams.set("drivetrain", drivetrainTypeSelect.value);

    // Color
    const colorSelect = document.getElementById("color-type") as HTMLSelectElement;
    if (colorSelect && colorSelect.value) queryParams.set("color", colorSelect.value);

    // Min Price
    const minPriceInput = document.getElementById("min-price") as HTMLInputElement;
    if (minPriceInput && minPriceInput.value) queryParams.set("minPrice", minPriceInput.value);

    // Max Price
    const maxPriceInput = document.getElementById("max-price") as HTMLInputElement;
    if (maxPriceInput && maxPriceInput.value) queryParams.set("maxPrice", maxPriceInput.value);

    // Year From
    const yearFromInput = document.getElementById("year-from") as HTMLInputElement;
    if (yearFromInput && yearFromInput.value) queryParams.set("yearFrom", yearFromInput.value);

    // Year To
    const yearToInput = document.getElementById("year-to") as HTMLInputElement;
    if (yearToInput && yearToInput.value) queryParams.set("yearTo", yearToInput.value);

    // Min Engine Size (cm³)
    const minEngineSizeInput = document.getElementById("motor-meret-min") as HTMLInputElement;
    if (minEngineSizeInput && minEngineSizeInput.value) queryParams.set("minEngineSize", minEngineSizeInput.value);

    // Max Engine Size (cm³)
    const maxEngineSizeInput = document.getElementById("motor-meret-max") as HTMLInputElement;
    if (maxEngineSizeInput && maxEngineSizeInput.value) queryParams.set("maxEngineSize", maxEngineSizeInput.value);

    // Min Mileage (km)
    const minMileageInput = document.getElementById("km-min") as HTMLInputElement;
    if (minMileageInput && minMileageInput.value) queryParams.set("minMileage", minMileageInput.value);

    // Max Mileage (km)
    const maxMileageInput = document.getElementById("km-max") as HTMLInputElement;
    if (maxMileageInput && maxMileageInput.value) queryParams.set("maxMileage", maxMileageInput.value);

    // Navigate to Cars page with query parameters
    navigate(`/cars?${queryParams.toString()}`);
  };

  const getRandomCars = (cars: CarDTO[], num: number) => {
    if (cars.length <= num) return cars;
    const shuffledCars = cars.sort(() => 0.5 - Math.random());
    return shuffledCars.slice(0, num);
  };

  return (
      <div className="content">
        {/* Keresési eredmények modal */}
        {showSearchResults && (
            <div id="search-results-modal" className="modal-overlay">
              <div className="modal-content">
                <span className="close-modal" onClick={() => setShowSearchResults(false)}>&times;</span>
                <h2>{langCtx?.translate.searchResult}</h2>
                <div className="car-list-results"></div>
              </div>
            </div>
        )}

        {/* Hero szekció */}
        <section className="hero">
          <h2>{langCtx?.translate.welcomeText}</h2>
          <p>{langCtx?.translate.searchCars}</p>
        </section>

        {/* Autókereső szűrő */}
        <section className="filter">
          <div className="container">
            <div className="search-form-container">
              <h2 className="search-form-title">{langCtx?.translate.searchTitle}</h2>

              <form className="search-form" onSubmit={handleSearchClick}>
                {/* Márka */}
                <div className="form-field">
                  <label htmlFor="brand-type">{langCtx?.translate.brand}</label>
                  <select
                      id="brand-type"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">{langCtx?.translate.chooseBrand}</option>
                    {makerTypeOptions.map(option => {
                        const count = carCountByBrand[option.id] || 0;
                        const label = count === 1 ? 'találat' : 'találat';
                        return (
                          <option key={option.id} value={option.id}>
                            {option.brandEnglish} ({count} {label})
                          </option>
                        );
                    })}
                  </select>
                </div>

                {/* Model */}
                <div className="form-field">
                  <label htmlFor="model-type">{langCtx?.translate.model}</label>
                  <select
                      id="model-type"
                      disabled={filteredModels.length === 0}
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="">{filteredModels.length === 0 ? langCtx?.translate.noModel : langCtx?.translate.chooseModel}</option>
                    {filteredModels.map(option => {
                        const count = carCountByModel[option.id] || 0;
                        const label = count === 1 ? 'találat' : 'találat';
                        return (
                          <option key={option.id} value={option.id}>
                            {option.modelNameEnglish} ({count} {label})
                          </option>
                        );
                    })}
                  </select>
                </div>

                {/* Karosszéria típus */}
                <div className="form-field">
                  <label htmlFor="body-type">{langCtx?.translate.bodyType}</label>
                  <select id="body-type" value={selectedBodyType} onChange={(e) => setSelectedBodyType(e.target.value)}>
                    <option value="">{langCtx?.translate.chooseBodyType}</option>
                    {bodyTypeOptions.map(option => {
                        const key = `${selectedModel}_${option.id}`;
                        const count = selectedModel ? (carCountByBodyTypeAndModel[key] || 0) : 0;
                        const label = count === 1 ? 'találat' : 'találat';
                        return (
                          <option key={option.id} value={option.id}>
                            {option.nameEnglish} ({count} {label})
                          </option>
                        );
                    })}
                  </select>
                </div>

                {/* Üzemanyag */}
                <div className="form-field">
                  <label htmlFor="fuel-type">{langCtx?.translate.fuel}</label>
                  <select id="fuel-type">
                    <option value="">{langCtx?.translate.chooseFuel}</option>
                    {fuelTypeOptions.map(option => {
                        // If model or body selected, try to show count for that combination, otherwise show total count
                        const key = `${selectedModel || '0'}_${selectedBodyType || '0'}_${option.id}`;
                        const countForKey = carCountByModelBodyFuel[key] || 0;
                        const totalCount = carCountByFuelTotal[option.id] || 0;
                        const displayCount = (selectedModel || selectedBodyType) ? countForKey : totalCount;
                        const label = displayCount === 1 ? 'találat' : 'találat';
                        return (
                          <option key={option.id} value={option.id}>
                            {option.nameEnglish} ({displayCount} {label})
                          </option>
                        );
                    })}
                  </select>
                </div>

                {/* Ár */}
                <div className="form-field">
                  <label htmlFor="min-price">{langCtx?.translate.Price}</label>
                  <div className="range-inputs">
                    <input type="number" id="min-price" placeholder="Min Ft" />
                    <input type="number" id="max-price" placeholder="Max Ft" />
                  </div>
                </div>

                {/* Év */}
                <div className="form-field">
                  <label htmlFor="year-from">{langCtx?.translate.Year}</label>
                  <div className="range-inputs">
                    <input type="number" id="year-from" placeholder="Min év" />
                    <input type="number" id="year-to" placeholder="Max év" />
                  </div>
                </div>

                {/* Részletes keresés kapcsoló */}
                <button
                    type="button"
                    className="advanced-search-toggle"
                    onClick={() => setIsAdvancedSearchVisible(!isAdvancedSearchVisible)}
                >
                  <span>{langCtx?.translate.moreSearch}</span>
                  <span className="toggle-arrow">{isAdvancedSearchVisible ? "▲" : "▼"}</span>
                </button>

                {/* Részletes keresési mezők */}
                {isAdvancedSearchVisible && (
                    <div className="advanced-search-fields">
                      {/* Hajtás */}
                      <div className="form-field">
                        <label htmlFor="drivetrain-type">{langCtx?.translate.drive}</label>
                        <select id="drivetrain-type">
                          <option value="">{langCtx?.translate.chooseDrivetrain}</option>
                          {drivetrainTypeOptions.map(option => (
                              <option key={option.id} value={option.id}>
                                {option.type}
                              </option>
                          ))}
                        </select>
                      </div>

                      {/* Szín */}
                      <div className="form-field">
                        <label htmlFor="color-type">{langCtx?.translate.color}</label>
                        <select id="color-type">
                          <option value="">{langCtx?.translate.chooseColor}</option>
                          {colorTypeOptions.map(option => (
                              <option key={option.id} value={option.id}>
                                {option.colorNameEnglish}
                              </option>
                          ))}
                        </select>
                      </div>

                      {/* Motor méret */}
                      <div className="form-field">
                        <label htmlFor="motor-meret-min">{langCtx?.translate.engineSize}</label>
                        <div className="range-inputs">
                          <input type="number" id="motor-meret-min" placeholder="Min cm³" />
                          <input type="number" id="motor-meret-max" placeholder="Max cm³" />
                        </div>
                      </div>

                      {/* Futott km */}
                      <div className="form-field">
                        <label htmlFor="km-min">{langCtx?.translate.mileageNum}</label>
                        <div className="range-inputs">
                          <input type="number" id="km-min" placeholder="Min km" />
                          <input type="number" id="km-max" placeholder="Max km" />
                        </div>
                      </div>
                    </div>
                )}

                {/* Keresés gomb */}
                <div className="search-form-button">
                  <button type="submit" className="search-button">
                    {langCtx?.translate.search}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="inventory">
          <div className="container">
            <h2 className="section-title">{langCtx?.translate.allCar}</h2>
            <div className="cars-list">
              {getRandomCars(cars, 6)?.map((car: CarDTO) => {
                const carImage = car.images?.length ? getBaseUrl() + car.images[0].url : null;

                return (
                  <div key={car.id} className="car-item">
                    {carImage && (
                      <img
                        src={carImage}
                        alt={`${car.brand.brandEnglish} ${car.carModel.modelNameEnglish}`}
                        className="car-image"
                      />
                    )}
                    <h3>
                      {`${car.brand.brandEnglish} ${car.carModel.modelNameEnglish}`}
                    </h3>
                      <p>
                        {langCtx?.translate.year} {car.carModel.manufacturingStartYear} - {car.carModel.manufacturingEndYear}
                      </p>
                      <p>
                        {langCtx?.translate.modelCode} {car.carModel.modelCode}
                      </p>
                      <p>
                        {langCtx?.translate.type} {car.bodyType.nameEnglish}
                      </p>
                      <p>
                        {langCtx?.translate.fuelType} {car.fuelType.nameEnglish}
                      </p>
                      <p>{langCtx?.translate.location}: {car.location.locationName}</p>
                      <p>
                        {langCtx?.translate.price} {Number(car.price).toLocaleString()} Ft
                      </p>
                      <button
                          className="btn"
                          onClick={() => navigate(`/Car-Details?carId=${encodeURIComponent(car?.id)}`)}
                      >
                        {langCtx?.translate.viewDetails}
                      </button>
                    </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bejelentkezési modal */}
        {showLoginModal && (
          <React.Suspense fallback={null}>
            <LoginModal
              onClose={() => setShowLoginModal(false)}
              t={langCtx?.translate || {}}
              language={language}
              showNotification={showNotification}
            />
          </React.Suspense>
        )}
      </div>
  );
}

export default Home;