'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	IActivities,
	IAirports,
	IHousings,
	IRestaurants,
	IVehicles,
} from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { activitySchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { MdModeEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';

type ActivityAccordionProps = {
	api: string;
	token: string;
	isAdmin: boolean;
	slug: string;
	activities: IActivities[];
	airports?: IAirports[];
	restaurants?: IRestaurants[];
	vehicles?: IVehicles[];
	housings?: IHousings[];
};

type ActivityFormData = z.infer<typeof activitySchema>;

export default function ActivityAccordion({
	api,
	token,
	isAdmin,
	slug,
	airports,
	restaurants,
	vehicles,
	housings,
	activities,
}: ActivityAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<IActivities | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ActivityFormData>({
		resolver: zodResolver(activitySchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof IActivities,
	) => {
		if (formData) {
			const value =
				field === 'airportId' ||
				field === 'restaurantId' ||
				field === 'companyOfVehicleId' ||
				field === 'hotelId'
					? Number(e.target.value)
					: e.target.value;
			setFormData({
				...formData,
				[field]: value,
			});
		}
	};

	const handleEdit = (activity: IActivities) => {
		setEditingId(activity.id);
		setFormData(activity);
		reset({
			activity: activity.activity,
			activityTime: activity.activityTime,
			hotelId: activity.hotelId,
			plateOfVehicle: activity.plateOfVehicle,
			contactOfDriver: activity.contactOfDriver,
			companyOfVehicleId: activity.companyOfVehicleId,
			restaurantId: activity.restaurantId,
			airportId: activity.airportId,
		});
	};

	const handleSave = async (data: ActivityFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			const response = await fetch(`${api}/put/activities/${formData.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'x-auth-token': `${token}`,
				},
				body: JSON.stringify(updatedData),
			});

			if (!response.ok) {
				const errText = await response.json();
				toast.error(errText.message || 'An unknown error occurred.');
				return;
			}

			const msg = response.text();

			toast.success('Success!', {
				description: msg,
			});

			setEditingId(null);
			setFormData(null);
			window.location.reload();
		} catch (error) {
			console.error('An unknown error occurred:', error);
			toast.error('An unknown error occurred.');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this activity?')) return;

		try {
			const res = await fetch(`${api}/delete/teams/${slug}/activity/${id}`, {
				method: 'DELETE',
				headers: {
					'x-auth-token': `${token}`,
				},
			});

			if (!res.ok) {
				const errText = await res.json();
				toast.error(errText.message || 'An unknown error occurred.');
				console.error(errText);
				return;
			}

			toast.success('Success!', {
				description: 'The activity is deleted!',
			});

			window.location.reload();
		} catch (err) {
			console.error('An unknown error occurred:', err);
			toast.error('An unknown error occurred.');
		}
	};

	return (
		<div className="flex justify-center w-[30rem]">
			<AccordionRoot type="single" collapsible className="w-full">
				{activities.map((v: IActivities) => (
					<AccordionItem
						value={v.id.toString()}
						key={v.id}
						className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
					>
						<AccordionTrigger className="font-bold text-2xl">
							{v.activityTime}
						</AccordionTrigger>

						<AccordionContent>
							<div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
								<div className="font-semibold">Activity:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('activity')}
											defaultValue={formData?.activity || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.activity
									)}
									{errors.activity && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.activity.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Activity Time:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="date"
											{...register('activityTime')}
											defaultValue={formData?.activityTime || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.activityTime
									)}
									{errors.activityTime && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.activityTime.message}
										</p>
									)}
								</div>

								{(housings && editingId === v.id) ||
								(housings && housings.length > 0 && v.hotel) ? (
									<>
										<div className="font-semibold">Hotel:</div>
										<div>
											{editingId === v.id ? (
												<select
													{...register('hotelId', { valueAsNumber: true })}
													value={String(formData?.hotelId || v.hotelId)}
													onChange={(e) => handleInputChange(e, 'hotelId')}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												>
													<option value={String(v.hotelId)}>{v.hotel}</option>
													{housings
														.filter((h) => h.id !== v.hotelId)
														.map((h) => (
															<option key={h.id} value={String(h.id)}>
																{h.housing}
															</option>
														))}
												</select>
											) : (
												v.hotel
											)}
										</div>
									</>
								) : null}

								{(airports && editingId === v.id) ||
								(airports && airports.length > 0 && v.airport) ? (
									<>
										<div className="font-semibold">Airport:</div>
										<div>
											{editingId === v.id ? (
												<select
													{...register('airportId', { valueAsNumber: true })}
													value={String(formData?.airportId || v.airportId)}
													onChange={(e) => handleInputChange(e, 'airportId')}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												>
													<option value={String(v.airportId)}>
														{v.airport}
													</option>
													{airports
														.filter((airport) => airport.id !== v.airportId)
														.map((airport) => (
															<option
																key={airport.id}
																value={String(airport.id)}
															>
																{airport.airport}
															</option>
														))}
												</select>
											) : (
												v.airport
											)}
										</div>
									</>
								) : null}

								{(restaurants && editingId === v.id) ||
								(restaurants && restaurants.length > 0 && v.restaurant) ? (
									<>
										<div className="font-semibold">Restaurant:</div>
										<div>
											{editingId === v.id ? (
												<select
													{...register('restaurantId', { valueAsNumber: true })}
													value={String(
														formData?.restaurantId || v.restaurantId,
													)}
													onChange={(e) => handleInputChange(e, 'restaurantId')}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												>
													<option value={String(v.restaurantId)}>
														{v.restaurant}
													</option>
													{restaurants
														.filter(
															(restaurant) => restaurant.id !== v.restaurantId,
														)
														.map((restaurant) => (
															<option
																key={restaurant.id}
																value={String(restaurant.id)}
															>
																{restaurant.restaurant}
															</option>
														))}
												</select>
											) : (
												v.restaurant
											)}
										</div>
									</>
								) : null}

								{(vehicles && editingId === v.id) ||
								(vehicles && vehicles.length > 0 && v.companyOfVehicle) ? (
									<>
										<div className="font-semibold">Plate of vehicle:</div>
										<div>
											{editingId === v.id ? (
												<input
													type="text"
													{...register('plateOfVehicle')}
													defaultValue={formData?.plateOfVehicle || ''}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												/>
											) : (
												v.plateOfVehicle
											)}
											{errors.plateOfVehicle && (
												<p className="bg-red-600 text-white text-xs p-1 rounded-md">
													{errors.plateOfVehicle.message}
												</p>
											)}
										</div>

										<div className="font-semibold">Driver&apos;s contact:</div>
										<div>
											{editingId === v.id ? (
												<input
													type="text"
													{...register('contactOfDriver')}
													defaultValue={formData?.contactOfDriver || ''}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												/>
											) : (
												v.contactOfDriver
											)}
											{errors.contactOfDriver && (
												<p className="bg-red-600 text-white text-xs p-1 rounded-md">
													{errors.contactOfDriver.message}
												</p>
											)}
										</div>

										<div className="font-semibold">Company of vehicle:</div>
										<div>
											{editingId === v.id ? (
												<select
													{...register('companyOfVehicleId', {
														valueAsNumber: true,
													})}
													value={String(
														formData?.companyOfVehicleId ||
															v.companyOfVehicleId,
													)}
													onChange={(e) =>
														handleInputChange(e, 'companyOfVehicleId')
													}
													className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
												>
													<option value={String(v.companyOfVehicleId)}>
														{v.companyOfVehicle}
													</option>
													{vehicles
														.filter(
															(company) => company.id !== v.companyOfVehicleId,
														)
														.map((company) => (
															<option
																key={company.id}
																value={String(company.id)}
															>
																{company.company}
															</option>
														))}
												</select>
											) : (
												v.companyOfVehicle
											)}
										</div>
									</>
								) : null}

								{isAdmin && isAdmin === true && (
									<div className="col-span-2">
										{editingId === v.id ? (
											<div className="flex gap-2">
												<button
													onClick={() => setEditingId(null)}
													className="bg-gray-700 hover:bg-gray-800 text-white rounded-md px-3 py-1 mt-2 flex flex-row items-center justify-center gap-1 sm:gap-2"
												>
													<MdCancel className="h-4 w-4 sm:h-5 sm:w-5" />
													Cancel
												</button>

												<button
													onClick={handleSubmit(handleSave)}
													className="bg-green-700 hover:bg-green-800 text-white rounded-md px-3 py-1 mt-2 flex flex-row items-center justify-center gap-1 sm:gap-2"
												>
													<MdSave className="h-4 w-4 sm:h-5 sm:w-5" />
													Save
												</button>

												<button
													onClick={() => handleDelete(v.id)}
													className="bg-red-700 hover:bg-red-800 text-white rounded-md px-3 py-1 mt-2 flex flex-row items-center justify-center gap-1 sm:gap-2"
												>
													<MdDelete className="h-4 w-4 sm:h-5 sm:w-5" />
													Delete
												</button>
											</div>
										) : (
											<button
												onClick={() => handleEdit(v)}
												className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1 mt-2 flex flex-row items-center justify-center gap-1 sm:gap-2"
											>
												<MdModeEdit className="h-4 w-4 sm:h-5 sm:w-5" />
												Edit Activity
											</button>
										)}
									</div>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</AccordionRoot>
		</div>
	);
}
