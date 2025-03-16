'use client';
import {
	ITeam,
	ITours,
	IGuides,
	IAirports,
	IRestaurants,
	IHousings,
	IVehicles,
	IActivities,
} from '@/lib/types';
import React, { useState } from 'react';
import { CardWrapper } from './partials/CardWrapper';
import { teamSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	MdTour,
	MdFlight,
	MdFlightTakeoff,
	MdFlightLand,
} from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { TbArrowGuide, TbBuildingAirport } from 'react-icons/tb';
import { FaCalendar, FaCalendarCheck } from 'react-icons/fa';
import { AddActivity } from './add/AddActivity';
import ActivityAccordion from './accordions/ActivityAccordion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdModeEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';

type TeamProps = {
	api: string;
	token: string;
	slug: string;
	team: ITeam;
	tours?: ITours[];
	guides?: IGuides[];
	airports?: IAirports[];
	isAdmin: boolean;
	restaurants?: IRestaurants[];
	vehicles?: IVehicles[];
	housings?: IHousings[];
	activities?: IActivities[];
};

type TeamFormData = z.infer<typeof teamSchema>;

function Team({
	api,
	token,
	slug,
	team,
	tours,
	guides,
	airports,
	isAdmin,
	restaurants,
	vehicles,
	housings,
	activities,
}: TeamProps) {
	const [formData, setFormData] = useState<ITeam | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [showActivities, setShowActivities] = useState<boolean>(false);
	const [addActivity, setAddActivity] = useState<boolean>(false);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TeamFormData>({
		resolver: zodResolver(teamSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof ITeam,
	) => {
		if (formData) {
			const value =
				field === 'guideId' ||
				field === 'tourId' ||
				field === 'flightOutwardDepartureAirportId' ||
				field === 'flightOutwardLandingAirportId' ||
				field === 'flightReturnDepartureAirportId' ||
				field === 'flightReturnLandingAirportId'
					? Number(e.target.value)
					: e.target.value;
			setFormData({
				...formData,
				[field]: value,
			});
		}
	};

	const handleSave = async (data: TeamFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			const response = await fetch(`${api}/put/teams/${slug}`, {
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
				console.error(errText);
				return;
			}

			const msg = response.text();

			toast.success('Success!', {
				description: msg,
			});

			setIsEditing(false);
			setFormData(null);
			window.location.reload();
		} catch (error) {
			console.error('An unknown error occurred:', error);
			toast.error('An unknown error occurred.');
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this team?')) return;

		try {
			const res = await fetch(`${api}/delete/teams/${slug}`, {
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
				description: 'The team is deleted!',
			});

			router.push('/dashboard');
		} catch (err) {
			console.error('An unknown error occurred:', err);
			toast.error('An unknown error occurred.');
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center p-4 sm:p-0">
			<CardWrapper title="Team Details">
				<div className="space-y-4 w-full max-w-2xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 place-items-center text-center">
						<div className="w-full col-span-1 sm:col-span-2">
							<div className="flex items-center justify-center gap-2 mb-2">
								<FaPeopleGroup className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Team</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="text"
										{...register('team')}
										defaultValue={formData?.team || ''}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white text-center"
									/>
								) : (
									team.team
								)}
								{errors.team && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.team.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdTour className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Tour</div>
							</div>
							<div className="font-medium text-sm sm:text-base">
								{isEditing ? (
									<select
										{...register('tourId', { valueAsNumber: true })}
										value={String(formData?.tourId || team.tourId)}
										onChange={(e) => handleInputChange(e, 'tourId')}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white text-sm"
									>
										<option value={String(team.tourId)}>
											{team.tour} ({team.numberOfDays} days,{' '}
											{team.numberOfNights} nights)
										</option>
										{tours
											?.filter((c: ITours) => c.id !== team.tourId)
											.map((c: ITours) => (
												<option key={c.id} value={String(c.id)}>
													{c.tour}
												</option>
											))}
									</select>
								) : (
									<span className="break-words">
										{team.tour} ({team.numberOfDays} days, {team.numberOfNights}{' '}
										nights)
									</span>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TbArrowGuide className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Guide</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<select
										{...register('guideId', { valueAsNumber: true })}
										value={String(formData?.guideId || team.guideId)}
										onChange={(e) => handleInputChange(e, 'guideId')}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
									>
										<option value={String(team.guideId)}>{team.guide}</option>
										{guides
											?.filter((c: IGuides) => c.id !== team.guideId)
											.map((c: IGuides) => (
												<option key={c.id} value={String(c.id)}>
													{c.name}
												</option>
											))}
									</select>
								) : (
									team.guide
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<FaCalendar className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Start Date</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('startsAt')}
										defaultValue={formData?.startsAt || ''}
									/>
								) : (
									team.startsAt
								)}
								{errors.startsAt && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.startsAt.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<FaCalendarCheck className="w-4 h-4" />
								<div className="text-gray-400 text-sm">End Date</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('endsAt')}
										defaultValue={formData?.endsAt || ''}
									/>
								) : (
									team.endsAt
								)}
								{errors.endsAt && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.endsAt.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlight className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Flight Outward No</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="text"
										{...register('flightOutwardNo')}
										defaultValue={formData?.flightOutwardNo || ''}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white text-center"
									/>
								) : (
									team.flightOutwardNo
								)}
								{errors.flightOutwardNo && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightOutwardNo.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlightTakeoff className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Outward Departure
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('flightOutwardDeparture')}
										defaultValue={formData?.flightOutwardDeparture || ''}
									/>
								) : (
									team.flightOutwardDeparture
								)}
								{errors.flightOutwardDeparture && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightOutwardDeparture.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TbBuildingAirport className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Outward Departure Airport
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<select
										{...register('flightOutwardDepartureAirport', {
											valueAsNumber: true,
										})}
										value={String(
											formData?.flightOutwardDepartureAirportId ||
												team.flightOutwardDepartureAirportId,
										)}
										onChange={(e) =>
											handleInputChange(e, 'flightOutwardDepartureAirportId')
										}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
									>
										<option
											value={String(team.flightOutwardDepartureAirportId)}
										>
											{team.flightOutwardDepartureAirport}
										</option>
										{airports
											?.filter(
												(c: IAirports) =>
													c.id !== team.flightOutwardDepartureAirportId,
											)
											.map((c: IAirports) => (
												<option key={c.id} value={String(c.id)}>
													{c.airport}
												</option>
											))}
									</select>
								) : (
									team.flightOutwardDepartureAirport
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlightLand className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Outward Landing
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('flightOutwardLanding')}
										defaultValue={formData?.flightOutwardLanding || ''}
									/>
								) : (
									team.flightOutwardLanding
								)}
								{errors.flightOutwardLanding && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightOutwardLanding.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TbBuildingAirport className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Outward Landing Airport
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<select
										{...register('flightOutwardLandingAirport', {
											valueAsNumber: true,
										})}
										value={String(
											formData?.flightOutwardLandingAirportId ||
												team.flightOutwardLandingAirportId,
										)}
										onChange={(e) =>
											handleInputChange(e, 'flightOutwardLandingAirportId')
										}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
									>
										<option value={String(team.flightOutwardLandingAirportId)}>
											{team.flightOutwardLandingAirport}
										</option>
										{airports
											?.filter(
												(c: IAirports) =>
													c.id !== team.flightOutwardLandingAirportId,
											)
											.map((c: IAirports) => (
												<option key={c.id} value={String(c.id)}>
													{c.airport}
												</option>
											))}
									</select>
								) : (
									team.flightOutwardLandingAirport
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlight className="w-4 h-4" />
								<div className="text-gray-400 text-sm">Flight Return No</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="text"
										{...register('flightReturnNo')}
										defaultValue={formData?.flightReturnNo || ''}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white text-center"
									/>
								) : (
									team.flightReturnNo
								)}
								{errors.flightReturnNo && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightReturnNo.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlightTakeoff className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Return Departure
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('flightReturnDeparture')}
										defaultValue={formData?.flightReturnDeparture || ''}
									/>
								) : (
									team.flightReturnDeparture
								)}
								{errors.flightReturnDeparture && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightReturnDeparture.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TbBuildingAirport className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Return Departure Airport
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<select
										{...register('flightReturnDepartureAirport', {
											valueAsNumber: true,
										})}
										value={String(
											formData?.flightReturnDepartureAirportId ||
												team.flightReturnDepartureAirportId,
										)}
										onChange={(e) =>
											handleInputChange(e, 'flightReturnDepartureAirportId')
										}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
									>
										<option value={String(team.flightReturnDepartureAirportId)}>
											{team.flightReturnDepartureAirport}
										</option>
										{airports
											?.filter(
												(c: IAirports) =>
													c.id !== team.flightReturnDepartureAirportId,
											)
											.map((c: IAirports) => (
												<option key={c.id} value={String(c.id)}>
													{c.airport}
												</option>
											))}
									</select>
								) : (
									team.flightReturnDepartureAirport
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<MdFlightLand className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Return Landing
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...register('flightReturnLanding')}
										defaultValue={formData?.flightReturnLanding || ''}
									/>
								) : (
									team.flightReturnLanding
								)}
								{errors.flightReturnLanding && (
									<p className="bg-red-600 text-white text-xs p-1 rounded-md">
										{errors.flightReturnLanding.message}
									</p>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TbBuildingAirport className="w-4 h-4" />
								<div className="text-gray-400 text-sm">
									Flight Return Landing Airport
								</div>
							</div>
							<div className="font-medium">
								{isEditing ? (
									<select
										{...register('flightReturnLandingAirport', {
											valueAsNumber: true,
										})}
										value={String(
											formData?.flightReturnLandingAirportId ||
												team.flightReturnLandingAirportId,
										)}
										onChange={(e) =>
											handleInputChange(e, 'flightReturnLandingAirportId')
										}
										className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
									>
										<option value={String(team.flightReturnLandingAirportId)}>
											{team.flightReturnLandingAirport}
										</option>
										{airports
											?.filter(
												(c: IAirports) =>
													c.id !== team.flightReturnLandingAirportId,
											)
											.map((c: IAirports) => (
												<option key={c.id} value={String(c.id)}>
													{c.airport}
												</option>
											))}
									</select>
								) : (
									team.flightReturnLandingAirport
								)}
							</div>
						</div>
					</div>

					{isAdmin && isAdmin === true && (
						<div className="pt-4 flex flex-col sm:flex-row justify-center gap-2">
							{isEditing ? (
								<div className="flex flex-col sm:flex-row gap-2">
									<button
										onClick={() => setIsEditing(false)}
										className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm flex flex-row items-center justify-center gap-1"
									>
										<MdCancel className="h-4 w-4 sm:h-5 sm:w-5" />
										Cancel
									</button>
									<button
										onClick={handleSubmit(handleSave)}
										className="w-full sm:w-auto bg-green-800 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm flex flex-row items-center justify-center gap-1"
									>
										<MdSave className="h-4 w-4 sm:h-5 sm:w-5" />
										Save
									</button>
									<button
										onClick={handleDelete}
										className="w-full sm:w-auto bg-red-800 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm flex flex-row items-center justify-center gap-1"
									>
										<MdDelete className="h-4 w-4 sm:h-5 sm:w-5" />
										Delete
									</button>
								</div>
							) : (
								<button
									onClick={() => {
										setIsEditing(!isEditing);
										setFormData(team);
									}}
									className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm flex flex-row items-center justify-center gap-1"
								>
									<MdModeEdit className="h-4 w-4 sm:h-5 sm:w-5" />
									Edit Team
								</button>
							)}
						</div>
					)}
				</div>
			</CardWrapper>

			{token && (
				<div className="mt-12">
					<div className="flex flex-col sm:flex-row gap-2 m-auto justify-center items-center mb-12">
						{isAdmin && isAdmin === true && (
							<>
								<Link
									href={`/team/${slug}/tourists`}
									className="bg-blue-800 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
								>
									Show tourists list
								</Link>

								<button
									onClick={() => {
										setShowActivities(false);
										setAddActivity(!addActivity);
									}}
									className="bg-blue-800 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
								>
									Add activity
								</button>
							</>
						)}

						<button
							onClick={() => {
								setShowActivities(!showActivities);
								setAddActivity(false);
							}}
							className="bg-blue-800 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
						>
							Show activities list
						</button>
					</div>

					<div
						className={`md:w-[40rem] flex justify-center items-center transition-all duration-300 ease-in-out overflow-hidden ${showActivities ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
					>
						{showActivities && (
							<ActivityAccordion
								api={api}
								token={token}
								isAdmin={isAdmin}
								slug={slug}
								activities={activities || []}
								airports={airports}
								restaurants={restaurants}
								vehicles={vehicles}
								housings={housings}
							/>
						)}
					</div>

					<div
						className={`md:w-[40rem] flex justify-center items-center transition-all duration-300 ease-in-out overflow-hidden ${addActivity ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
					>
						{addActivity && (
							<AddActivity
								api={api}
								token={token}
								teamId={team.id}
								airports={airports}
								restaurants={restaurants}
								vehicles={vehicles}
								housings={housings}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Team;
