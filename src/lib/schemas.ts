import { z } from 'zod';

export const tourSchema = z.object({
	tour: z.string().min(2, {
		message: 'Tour must be at least 2 characters.',
	}),
	cityId: z.number().min(1, { message: 'City is required.' }),
	numberOfDays: z
		.number()
		.min(1, { message: 'Number of days must be at least 1.' }),
	numberOfNights: z
		.number()
		.min(1, { message: 'Number of nights must be at least 1.' }),
});

export const guideSchema = z
	.object({
		name: z.string().min(2, {
			message: 'Name must be at least 2 characters.',
		}),
		username: z.string().min(2, {
			message: 'Username must be at least 2 characters.',
		}),
		email: z
			.string()
			.email({ message: 'Invalid email address' })
			.min(5, { message: 'Email must be 8 or more characters long' }),
		phone: z.string(),
		passportNo: z.string().min(6, {
			message: 'Passport number must be at least 6 characters.',
		}),
		birth: z.string().min(10, {
			message: 'Birth date must be at least 10 characters.',
		}),
		nationalityId: z.number(),
		languageId: z.number(),
		intimate: z.string().min(2, {
			message: 'Intimate must be at least 2 characters.',
		}),
		intimatePhone: z.string(),
		intimacy: z.string().min(2, {
			message: 'Intimacy must be at least 2 characters.',
		}),
		isAdmin: z.boolean(),
		password: z.string().min(8, {
			message: 'Password must be at least 8 characters',
		}),
		rePassword: z.string().min(8, {
			message: 'Password must be at least 8 characters',
		}),
	})
	.refine((data) => data.password === data.rePassword, {
		message: 'Passwords do not match',
		path: ['rePassword'],
	});

export const teamSchema = z.object({
	team: z.string().min(2, {
		message: 'Team must be at least 2 characters.',
	}),
	tourId: z.number(),
	startsAt: z.string().min(10, {
		message: 'Start date must be at least 10 characters.',
	}),
	endsAt: z.string().min(10, {
		message: 'End date must be at least 10 characters.',
	}),
	guideId: z.number(),
	flightOutwardNo: z.string(),
	flightOutwardDeparture: z.string(),
	flightOutwardDepartureAirport: z.number(),
	flightOutwardLanding: z.string(),
	flightOutwardLandingAirport: z.number(),
	flightReturnNo: z.string(),
	flightReturnDeparture: z.string(),
	flightReturnDepartureAirport: z.number(),
	flightReturnLanding: z.string(),
	flightReturnLandingAirport: z.number(),
});

export const touristSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	birth: z.string().min(10, {
		message: 'Birth date must be at least 10 characters.',
	}),
	genderId: z.number(),
	nationalityId: z.number(),
	phone: z.string(),
	address: z.string().min(2, {
		message: 'Address must be at least 2 characters.',
	}),
	passportNo: z.string().min(6, {
		message: 'Passport number must be at least 6 characters.',
	}),
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.min(5, { message: 'Email must be 8 or more characters long' }),
	intimate: z.string().min(2, {
		message: 'Intimate must be at least 2 characters.',
	}),
	intimacy: z.string().min(2, {
		message: 'Intimacy must be at least 2 characters.',
	}),
	intimatePhone: z.string(),
	amount: z.number(),
	currencyId: z.number(),
	paymentMethodId: z.number(),
	isPayed: z.boolean(),
	teamId: z.number().int(),
});

export const loginSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters',
	}),
});

export const otherSchema = z.object({
	id: z.number(),
	value: z.string(),
});

export const vehicleSchema = z.object({
	company: z.string().min(2, {
		message: 'Company must be at least 2 characters.',
	}),
	contactCompany: z.string().min(2, {
		message: 'Contact company must be at least 2 characters.',
	}),
	officer: z.string().min(2, {
		message: 'Officer must be at least 2 characters.',
	}),
	contactOfficer: z.string().min(2, {
		message: 'Contact officer must be at least 2 characters.',
	}),
});

export const housingSchema = z.object({
	housing: z.string().min(2, {
		message: 'Housing must be at least 2 characters.',
	}),
	cityId: z.number(),
	district: z.string().min(2, {
		message: 'District must be at least 2 characters.',
	}),
	address: z.string().min(2, {
		message: 'Address must be at least 2 characters.',
	}),
	officer: z.string().min(2, {
		message: 'Officer must be at least 2 characters.',
	}),
	contactOfficer: z.string().min(2, {
		message: 'Contact officer must be at least 2 characters.',
	}),
	contactHousing: z.string().min(2, {
		message: 'Contact housing must be at least 2 characters.',
	}),
});

export const restaurantSchema = z.object({
	restaurant: z.string().min(2, {
		message: 'Restaurant must be at least 2 characters.',
	}),
	cityId: z.number(),
	district: z.string().min(2, {
		message: 'District must be at least 2 characters.',
	}),
	address: z.string().min(2, {
		message: 'Address must be at least 2 characters.',
	}),
	officer: z.string().min(2, {
		message: 'Officer must be at least 2 characters.',
	}),
	contactOfficer: z.string().min(2, {
		message: 'Contact officer must be at least 2 characters.',
	}),
	contactRestaurant: z.string().min(2, {
		message: 'Contact restaurant must be at least 2 characters.',
	}),
});

export const activitySchema = z
	.object({
		activity: z.string().min(2, {
			message: 'Activity must be at least 2 characters.',
		}),
		activityTime: z.string().min(10, {
			message: 'Activity time must be at least 10 characters.',
		}),
		teamId: z.number().int(),
		hotelId: z.number().int().optional(),
		restaurantId: z.number().int().optional(),
		companyOfVehicleId: z.number().int().optional(),
		plateOfVehicle: z.string(),
		contactOfDriver: z.string(),
		airportId: z.number().int().optional(),
	})
	.refine(
		(data) => {
			const selectedFields = [
				data.hotelId,
				data.airportId,
				data.companyOfVehicleId,
				data.restaurantId,
			];
			const filledCount = selectedFields.filter((v) => v !== undefined).length;

			return filledCount === 1;
		},
		{
			message:
				'Only one of hotel, airport, company of vehicle, or restaurant must be provided.',
			path: ['hotelId', 'airportId', 'companyOfVehicleId', 'restaurantId'],
		},
	);
