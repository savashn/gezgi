'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	INationalities,
	ITourists,
	IGenders,
	ICurrencies,
	IPaymentMethods,
} from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { touristSchema } from '@/lib/schemas';
import { toast } from 'sonner';

type TouristAccordionProps = {
	data: ITourists[];
	api: string;
	token: string;
	admin: boolean;
	nationalities?: INationalities[];
	genders?: IGenders[];
	currencies?: ICurrencies[];
	paymentMethods?: IPaymentMethods[];
};

type TouristFormData = z.infer<typeof touristSchema>;

export default function TouristAccordion({
	data,
	api,
	token,
	admin,
	nationalities,
	genders,
	currencies,
	paymentMethods,
}: TouristAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<ITourists | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TouristFormData>({
		resolver: zodResolver(touristSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof ITourists,
	) => {
		if (formData) {
			const value =
				field === 'genderId' ||
				field === 'nationalityId' ||
				field === 'currencyId' ||
				field === 'paymentMethodId'
					? Number(e.target.value)
					: e.target.value;
			setFormData({
				...formData,
				[field]: value,
			});
		}
	};

	const handleEdit = (tourist: ITourists) => {
		setEditingId(tourist.id);
		setFormData(tourist);
		reset({
			name: tourist.name,
			birth: tourist.birth,
			genderId: tourist.genderId,
			nationalityId: tourist.nationalityId,
			passportNo: tourist.passportNo,
			email: tourist.email,
			phone: tourist.phone,
			intimate: tourist.intimate,
			intimacy: tourist.intimacy,
			intimatePhone: tourist.intimatePhone,
			amount: tourist.amount,
			currencyId: tourist.currencyId,
			paymentMethodId: tourist.paymentMethodId,
			isPayed: tourist.isPayed,
		});
	};

	const handleSave = async (data: TouristFormData) => {
		if (!formData) return;

		try {
			const { ...restData } = data;
			const updatedData = {
				...formData,
				...restData,
			};

			const response = await fetch(`${api}/put/tourists/${formData.id}`, {
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
		<div className="flex justify-center w-[30rem]">
			<AccordionRoot type="single" collapsible className="w-full">
				{data.map((v: ITourists) => (
					<AccordionItem
						value={v.id.toString()}
						key={v.id}
						className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
					>
						<AccordionTrigger className="font-bold text-2xl">
							{v.name}
						</AccordionTrigger>

						<AccordionContent>
							<div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
								<div className="font-semibold">Name:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('name')}
											defaultValue={formData?.name || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.name
									)}
									{errors.name && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Email:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="email"
											{...register('email')}
											defaultValue={formData?.email || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.email
									)}
									{errors.email && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.email.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Phone:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="tel"
											{...register('phone')}
											defaultValue={formData?.phone || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.phone
									)}
									{errors.phone && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.phone.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Passport No:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('passportNo')}
											defaultValue={formData?.passportNo || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.passportNo
									)}
									{errors.passportNo && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.passportNo.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Nationality:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('nationalityId')}
											value={String(formData?.nationalityId || v.nationalityId)}
											onChange={(e) => handleInputChange(e, 'nationalityId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.nationalityId)}>
												{v.nationality}
											</option>
											{nationalities &&
												nationalities
													.filter(
														(nationality) => nationality.id !== v.nationalityId,
													)
													.map((nationality) => (
														<option
															key={nationality.id}
															value={String(nationality.id)}
														>
															{nationality.nationality}
														</option>
													))}
										</select>
									) : (
										v.nationality
									)}
								</div>

								<div className="font-semibold">Gender:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('genderId')}
											value={String(formData?.genderId || v.genderId)}
											onChange={(e) => handleInputChange(e, 'genderId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.genderId)}>{v.gender}</option>
											{genders &&
												genders
													.filter((gender) => gender.id !== v.genderId)
													.map((gender) => (
														<option key={gender.id} value={String(gender.id)}>
															{gender.gender}
														</option>
													))}
										</select>
									) : (
										v.gender
									)}
								</div>

								<div className="font-semibold">Birth:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="date"
											{...register('birth')}
											defaultValue={formData?.birth || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.birth
									)}
									{errors.birth && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.birth.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Intimate:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('intimate')}
											defaultValue={formData?.intimate || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.intimate
									)}
									{errors.intimate && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.intimate.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Intimacy:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('intimacy')}
											defaultValue={formData?.intimacy || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.intimacy
									)}
									{errors.intimacy && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.intimacy.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Intimate Phone:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="tel"
											{...register('intimatePhone')}
											defaultValue={formData?.intimatePhone || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.intimatePhone
									)}
									{errors.intimatePhone && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.intimatePhone.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Amount:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="number"
											{...register('amount')}
											defaultValue={formData?.amount || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.amount
									)}
									{errors.amount && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.amount.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Currency:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('currencyId')}
											value={String(formData?.currencyId || v.currencyId)}
											onChange={(e) => handleInputChange(e, 'currencyId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.currencyId)}>{v.currency}</option>
											{currencies &&
												currencies
													.filter((currency) => currency.id !== v.currencyId)
													.map((currency) => (
														<option
															key={currency.id}
															value={String(currency.id)}
														>
															{currency.currency}
														</option>
													))}
										</select>
									) : (
										v.currency
									)}
								</div>

								<div className="font-semibold">Payment Method:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('paymentMethodId')}
											value={String(
												formData?.paymentMethodId || v.paymentMethodId,
											)}
											onChange={(e) => handleInputChange(e, 'paymentMethodId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.paymentMethodId)}>
												{v.paymentMethod}
											</option>
											{paymentMethods &&
												paymentMethods
													.filter(
														(paymentMethod) =>
															paymentMethod.id !== v.paymentMethodId,
													)
													.map((paymentMethod) => (
														<option
															key={paymentMethod.id}
															value={String(paymentMethod.id)}
														>
															{paymentMethod.method}
														</option>
													))}
										</select>
									) : (
										v.paymentMethod
									)}
								</div>

								<div className="font-semibold">Is Payed:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="checkbox"
											{...register('isPayed')}
											defaultChecked={formData?.isPayed}
										/>
									) : v.isPayed ? (
										'Yes'
									) : (
										'No'
									)}
								</div>

								{admin && (
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
												Edit Tourist
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
