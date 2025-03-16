'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { IVehicles } from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { vehicleSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { AddVehicle } from '../add/AddVehicle';
type VehicleAccordionProps = {
	data: IVehicles[];
	api: string;
	token: string;
	isAdmin: boolean;
};

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleAccordion({
	data,
	api,
	token,
	isAdmin,
}: VehicleAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<IVehicles | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<VehicleFormData>({
		resolver: zodResolver(vehicleSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof IVehicles,
	) => {
		if (formData) {
			setFormData({
				...formData,
				[field]: e.target.value,
			});
		}
	};

	const handleEdit = (tour: IVehicles) => {
		setEditingId(tour.id);
		setFormData(tour);
		reset({
			company: tour.company,
			contactCompany: tour.contactCompany,
			officer: tour.officer,
			contactOfficer: tour.contactOfficer,
		});
	};

	const handleSave = async (data: VehicleFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			const response = await fetch(`${api}/put/vehicles/${formData.id}`, {
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
				{data.map((v: IVehicles) => (
					<AccordionItem
						value={v.id.toString()}
						key={v.id}
						className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
					>
						<AccordionTrigger className="font-bold text-2xl">
							{v.company}
						</AccordionTrigger>

						<AccordionContent>
							<div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
								<div className="font-semibold">Company:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('company')}
											defaultValue={formData?.company || ''}
											onChange={(e) => handleInputChange(e, 'company')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.company
									)}
									{errors.company && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.company.message}
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
											onChange={(e) => handleInputChange(e, 'officer')}
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

								<div className="font-semibold">Contact Company:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('contactCompany')}
											defaultValue={formData?.contactCompany || ''}
											onChange={(e) => handleInputChange(e, 'contactCompany')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.contactCompany
									)}
									{errors.contactCompany && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.contactCompany.message}
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
											onChange={(e) => handleInputChange(e, 'contactOfficer')}
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

								{isAdmin && isAdmin === true && (
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
												Edit Vehicle
											</button>
										)}
									</div>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
				{isAdmin && isAdmin === true && (
					<div className="flex justify-center w-full mt-12">
						<AddVehicle api={api} token={token} />
					</div>
				)}
			</AccordionRoot>
		</div>
	);
}
