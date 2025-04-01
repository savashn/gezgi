export interface DecodedToken {
	name: string;
	id: number;
	isAdmin: boolean;
}

export interface IActivities {
	id: number;
	activity: string;
	activityTime: string;
	teamId: number;
	hotel: string;
	hotelId: number;
	plateOfVehicle: string;
	contactOfDriver: string;
	companyOfVehicleId: number;
	companyOfVehicle: string;
	restaurantId: number;
	restaurant: string;
	airportId: number;
	airport: string;
}

export interface ITeams {
	id: number;
	team: string;
	tourId: number;
	tour: string;
	tourDays: number;
	tourNights: number;
	startsAt: string;
	endsAt: string;
	guideId: number;
	guide?: string;
	guideSlug?: string;
}

export interface ITeam {
	id: number;
	team: string;
	tour: string;
	tourId: number;
	numberOfDays: number;
	numberOfNights: number;
	startsAt: string;
	endsAt: string;
	guide: string;
	guideId: number;
	guideSlug: string;
	flightOutwardNo: string;
	flightOutwardDeparture: string;
	flightOutwardDepartureAirport: string;
	flightOutwardDepartureAirportId: number;
	flightOutwardLanding: string;
	flightOutwardLandingAirport: string;
	flightOutwardLandingAirportId: number;
	flightReturnNo: string;
	flightReturnDeparture: string;
	flightReturnDepartureAirport: string;
	flightReturnDepartureAirportId: number;
	flightReturnLanding: string;
	flightReturnLandingAirport: string;
	flightReturnLandingAirportId: number;
	tours?: ITours[];
	guides?: IGuides[];
	airports?: IAirports[];
}

export interface ITours {
	id: number;
	tour: string;
	city: string;
	cityId: number;
	numberOfDays: number;
	numberOfNights: number;
}

export interface ICities {
	id: number;
	city: string;
}

export interface IVehicles {
	id: number;
	company: string;
	contactCompany: string;
	officer: string;
	contactOfficer: string;
}

export interface IHousings {
	id: number;
	housing: string;
	city: string;
	cityId: number;
	district: string;
	address: string;
	officer: string;
	contactOfficer: string;
	contactHousing: string;
}

export interface IGuides {
	id: number;
	name: string;
	username: string;
	language: string;
	languageId: number;
	email: string;
	phone: string;
	passportNo: string;
	nationality: string;
	nationalityId: number;
	birth: string;
	intimate: string;
	intimacy: string;
	intimatePhone: string;
	isAdmin: boolean;
}

export interface ILanguages {
	id: number;
	language: string;
}

export interface INationalities {
	id: number;
	nationality: string;
}

export interface IAirports {
	id: number;
	airport: string;
}

export interface ICurrencies {
	id: number;
	currency: string;
}

export interface IPaymentMethods {
	id: number;
	method: string;
}

export interface IGenders {
	id: number;
	gender: string;
}

export interface IRestaurants {
	id: number;
	restaurant: string;
	city: string;
	cityId: number;
	district: string;
	address: string;
	officer: string;
	contactOfficer: string;
	contactRestaurant: string;
}

export interface ITourists {
	id: number;
	name: string;
	birth: string;
	gender: string;
	genderId: number;
	nationalityId: number;
	nationality: string;
	passportNo: string;
	email: string;
	phone: string;
	address: string;
	intimate: string;
	intimacy: string;
	intimatePhone: string;
	amount: number;
	currency: string;
	currencyId: number;
	paymentMethod: string;
	paymentMethodId: number;
	isPayed: boolean;
}

export interface Api {
	api: string;
	token: string | null;
}

export interface OthersResponse {
	// SHALL BE DELETED
	cities?: ICities[];
	nationalities?: INationalities[];
	currencies?: ICurrencies[];
	airports?: IAirports[];
	languages?: ILanguages[];
	paymentMethods?: IPaymentMethods[];
	genders?: IGenders[];
	vehicles?: IVehicles[];
	housings?: IHousings[];
	restaurants?: IRestaurants[];
}

export interface IItem {
	id: number;
	value: string;
}
