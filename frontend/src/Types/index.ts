// Itt definiálhatod az alkalmazásban használt típusokat, pl:

export type CarDTO = {
    id: number;
    brand: CarMakerDTO;
    carModel: CarModelDTO;
    grade: string;
    bodyType: BodyTypeDTO;
    location: LocationDTO;
    engineSize: EngineSizeModelDTO;
    licensePlateNumber?: string | null;
    repairHistory: boolean;
    fuelType: FuelTypeDTO;
    driveTrain: DrivetrainTypeDTO;
    motExpiry?: string | null;
    transmissionType: TransmissionTypeDTO;
    vinNum: string;
    color: ColorDTO;
    isSmoking: boolean;
    extras: CarExtraDTO[];
    mileage?: number;
    isInTransfer: boolean;
    price?: string | null;
    images: ImageDTO[];
};

export type ImageDTO = {
    url: string;
};



export type CarMakerDTO = {
    id: number;
    brandEnglish: string;
    BrandDeutsch: string;
};

export type CarModelDTO = {
    id: number;
    makerID: number;
    ModelNameDeutsch: string;
    modelNameEnglish: string;
    modelCode: string;
    manufacturingStartYear: number;
    manufacturingEndYear: number;
    passengerCount: number;
    length: number;
    width: number;
    height: number;
    mass: number;
    maker: CarMakerDTO;
    engineSizes: EngineSizeModelDTO[];
};

export type BodyTypeDTO = {
    id: number;
    NameDeutsch: string;
    nameEnglish: string;
};

export type LocationDTO = {
    id: number;
    locationName: string;
    address: AddressDTO;
    maxCapacity: number;
    phoneNumber: string;
};

export type AddressDTO = {
    postalCode: string;
    city: string;
    cityRomanized: string;
    street: string;
    streetRomanized: string;
};

export type EngineSizeModelDTO = {
    id: number;
    fuelType: FuelTypeDTO;
    engineSize: number;
};

export type FuelTypeDTO = {
    id: number;
    NameDeutsch: string;
    nameEnglish: string;
};

export type DrivetrainTypeDTO = {
    id: number;
    type: string;
};

export type TransmissionTypeDTO = {
    id: number;
    type: string;
};


export type ColorDTO = {
    id: number;
    colorNameEnglish: string;
    colorNameDeutsch: string;
};

export type CarExtraDTO = {
    id: number;
    name: string;
};

