'use client';
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { IGuides, ILanguages, INationalities } from '@/lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { guideSchema } from '@/lib/schemas';
import { toast } from 'sonner';

type GuideAccordionProps = {
	data: IGuides[];
	api: string;
	token: string;
	nationalities: INationalities[];
	languages: ILanguages[];
};

type GuideFormData = z.infer<typeof guideSchema>;

export default function GuideAccordion({
	data,
	api,
	token,
	nationalities,
	languages,
}: GuideAccordionProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<IGuides | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<GuideFormData>({
		resolver: zodResolver(guideSchema),
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		field: keyof IGuides,
	) => {
		if (formData) {
			const value =
				field === 'languageId' || field === 'nationalityId'
					? Number(e.target.value)
					: e.target.value;
			setFormData({
				...formData,
				[field]: value,
			});
		}
	};

	const handleEdit = (guide: IGuides) => {
		setEditingId(guide.id);
		setFormData(guide);
		reset({
			name: guide.name,
			username: guide.username,
			languageId: guide.languageId,
			email: guide.email,
			phone: guide.phone,
			passportNo: guide.passportNo,
			nationalityId: guide.nationalityId,
			birth: guide.birth,
			intimate: guide.intimate,
			intimacy: guide.intimacy,
			intimatePhone: guide.intimatePhone,
			isAdmin: guide.isAdmin,
		});
	};

	const handleSave = async (data: GuideFormData) => {
		if (!formData) return;

		try {
			const { password, rePassword, ...restData } = data;
			const updatedData = {
				...formData,
				...(password ? { password, rePassword } : {}),
				...restData,
			};

			const response = await fetch(`${api}/put/guides/${formData.id}`, {
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
				{data.map((v: IGuides) => (
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

								<div className="font-semibold">Username:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="text"
											{...register('username')}
											defaultValue={formData?.username || ''}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										/>
									) : (
										v.username
									)}
									{errors.username && (
										<p className="bg-red-600 text-white text-xs p-1 rounded-md">
											{errors.username.message}
										</p>
									)}
								</div>

								<div className="font-semibold">Language:</div>
								<div>
									{editingId === v.id ? (
										<select
											{...register('languageId', { valueAsNumber: true })}
											value={String(formData?.languageId || v.languageId)}
											onChange={(e) => handleInputChange(e, 'languageId')}
											className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
										>
											<option value={String(v.languageId)}>{v.language}</option>
											{languages
												.filter((lang) => lang.id !== v.languageId)
												.map((lang) => (
													<option key={lang.id} value={String(lang.id)}>
														{lang.language}
													</option>
												))}
										</select>
									) : (
										v.language
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
											{nationalities
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

								{editingId === v.id ? (
									<>
										<div className="font-semibold">New Password:</div>
										<div>
											<input
												type="password"
												{...register('password')}
												className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
											/>
										</div>
										{errors.password && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.password.message}
											</p>
										)}

										<div className="font-semibold">Password Again:</div>
										<div>
											<input
												type="password"
												{...register('rePassword')}
												className="border rounded px-2 py-1 w-full bg-gray-700 text-white"
											/>
										</div>
										{errors.rePassword && (
											<p className="bg-red-600 text-white text-xs p-1 rounded-md">
												{errors.rePassword.message}
											</p>
										)}
									</>
								) : null}

								<div className="font-semibold">Manager:</div>
								<div>
									{editingId === v.id ? (
										<input
											type="checkbox"
											{...register('isAdmin')}
											defaultChecked={formData?.isAdmin}
										/>
									) : v.isAdmin ? (
										'Yes'
									) : (
										'No'
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
											Edit Guide
										</button>
									)}
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</AccordionRoot>
		</div>
	);
}
