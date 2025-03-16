'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { IHousings, ICities } from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { housingSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { AddHousing } from '../add/AddHousing';

type HousingAccordionProps = {
	data: IHousings[];
	api: string;
	token: string;
	isAdmin: boolean;
	cities: ICities[];
};

type HousingFormData = z.infer<typeof housingSchema>;

export default function HousingAccordion({
	data,
	api,
	token,
	isAdmin,
	cities,
}: HousingAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<IHousings | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<HousingFormData>({
		resolver: zodResolver(housingSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof IHousings,
	) => {
		if (formData) {
			const value =
				field === 'cityId' ? Number(e.target.value) : e.target.value;
			setFormData({
				...formData,
				[field]: value,
			});
		}
	};

	const handleEdit = (housing: IHousings) => {
		setEditingId(housing.id);
		setFormData(housing);
		reset({
			housing: housing.housing,
			cityId: housing.cityId,
			district: housing.district,
			address: housing.address,
			officer: housing.officer,
			contactOfficer: housing.contactOfficer,
			contactHousing: housing.contactHousing,
		});
	};

	const handleSave = async (data: HousingFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			console.log(updatedData);

			const response = await fetch(`${api}/put/housings`, {
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

	return (
		<div className="flex justify-center w-full">
			<AccordionRoot type="single" collapsible className="w-full">
				{data.map((v: IHousings) => (
					<AccordionItem
						value={v.id.toString()}
						key={v.id}
						className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
					>
						<AccordionTrigger className="font-bold text-2xl">
							{v.housing}
						</AccordionTrigger>

						<AccordionContent>
							<div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
								<div className="font-semibold">Housing:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('housing')}
											defaultValue={formData?.housing || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.housing
									)}
									{errors.housing && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.housing.message}
										</p>
									)}
								</div>

								<div className="font-semibold">City:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('cityId', { valueAsNumber: true })}
											value={String(formData?.cityId || v.cityId)}
											onChange={(e) => handleInputChange(e, 'cityId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.cityId)}>{v.city}</option>
											{cities
												.filter((city) => city.id !== v.cityId)
												.map((city) => (
													<option key={city.id} value={String(city.id)}>
														{city.city}
													</option>
												))}
										</select>
									) : (
										v.city
									)}
								</div>

								<div className="font-semibold">District:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('district')}
											defaultValue={formData?.district || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.district
									)}
									{errors.district && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.district.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Address:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('address')}
											defaultValue={formData?.address || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.address
									)}
									{errors.address && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.address.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Officer:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('officer')}
											defaultValue={formData?.officer || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.officer
									)}
									{errors.officer && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.officer.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Contact Officer:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('contactOfficer')}
											defaultValue={formData?.contactOfficer || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.contactOfficer
									)}
									{errors.contactOfficer && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.contactOfficer.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Contact Housing:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('contactHousing')}
											defaultValue={formData?.contactHousing || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.contactHousing
									)}
									{errors.contactHousing && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.contactHousing.message}
										</p>
									)}
								</div>

								<div className="col-span-2">
									{editingId === v.id ? (
										<div className="flex gap-2">
											<button
												onClick={() => setEditingId(null)}
												className="bg-gray-700 text-white rounded-md px-3 py-1 mt-2"
											>
												Cancel
											</button>
											<button
												onClick={handleSubmit(handleSave)}
												className="bg-green-700 text-white rounded-md px-3 py-1 mt-2"
											>
												Save
											</button>
										</div>
									) : (
										<button
											onClick={() => handleEdit(v)}
											className="bg-blue-700 text-white rounded-md px-3 py-1 mt-2"
										>
											Edit Housing
										</button>
									)}
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}

				{isAdmin && isAdmin === true && (
					<div className="flex justify-center w-full mt-12">
						<AddHousing api={api} token={token} cities={cities} />
					</div>
				)}
			</AccordionRoot>
		</div>
	);
}
