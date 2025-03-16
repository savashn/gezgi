'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ITours, ICities } from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { tourSchema } from '@/lib/schemas';
import { toast } from 'sonner';

type TourAccordionProps = {
	data: ITours[];
	api: string;
	token: string;
	cities: ICities[];
};

type TourFormData = z.infer<typeof tourSchema>;

export default function TourAccordion({
	data,
	api,
	token,
	cities,
}: TourAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<ITours | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TourFormData>({
		resolver: zodResolver(tourSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof ITours,
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

	const handleEdit = (tour: ITours) => {
		setEditingId(tour.id);
		setFormData(tour);
		reset({
			tour: tour.tour,
			cityId: tour.cityId,
			numberOfDays: tour.numberOfDays,
			numberOfNights: tour.numberOfNights,
		});
	};

	const handleSave = async (data: TourFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			const response = await fetch(`${api}/put/tours`, {
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

			const msg = await response.text();

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
				{data.map((v: ITours) => (
					<AccordionItem
						value={v.id.toString()}
						key={v.id}
						className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
					>
						<AccordionTrigger className="font-bold text-2xl">
							{v.tour}
						</AccordionTrigger>

						<form onSubmit={handleSubmit(handleSave)} className="w-full">
							<AccordionContent>
								<div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
									<div className="font-semibold">Tour:</div>
									<div>
										{editingId === v.id ? (
											<input
												type="text"
												{...register('tour')}
												defaultValue={formData?.tour || ''}
												className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
											/>
										) : (
											v.tour
										)}
										{errors.tour && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.tour.message}
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
													.filter((c) => c.id !== v.cityId)
													.map((c) => (
														<option key={c.id} value={String(c.id)}>
															{c.city}
														</option>
													))}
											</select>
										) : (
											v.city
										)}
										{errors.cityId && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.cityId.message}
											</p>
										)}
									</div>

									<div className="font-semibold">Number of Days:</div>
									<div>
										{editingId === v.id ? (
											<input
												type="number"
												{...register('numberOfDays', { valueAsNumber: true })}
												defaultValue={formData?.numberOfDays || ''}
												min="0"
												className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
											/>
										) : (
											v.numberOfDays
										)}
										{errors.numberOfDays && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.numberOfDays.message}
											</p>
										)}
									</div>

									<div className="font-semibold">Number of Nights:</div>
									<div>
										{editingId === v.id ? (
											<input
												type="number"
												{...register('numberOfNights', { valueAsNumber: true })}
												defaultValue={formData?.numberOfNights || ''}
												min="0"
												className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
											/>
										) : (
											v.numberOfNights
										)}
										{errors.numberOfNights && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.numberOfNights.message}
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
													type="submit"
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
												Edit Tour
											</button>
										)}
									</div>
								</div>
							</AccordionContent>
						</form>
					</AccordionItem>
				))}
			</AccordionRoot>
		</div>
	);
}
