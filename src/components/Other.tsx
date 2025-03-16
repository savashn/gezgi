'use client';
import { IItem } from '@/lib/types';
import React, { useState } from 'react';
import { CardWrapper } from './partials/CardWrapper';
import { otherSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MdModeEdit, MdDelete } from 'react-icons/md';

type OthersProps = {
	api: string;
	token: string;
	slug: string;
	isAdmin: boolean;
	items: IItem[];
};

type OtherFormData = z.infer<typeof otherSchema>;

function Other({ api, token, slug, items, isAdmin }: OthersProps) {
	const [formData, setFormData] = useState<IItem | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);

	const { register, handleSubmit, reset } = useForm<OtherFormData>({
		resolver: zodResolver(otherSchema),
	});

	const handleEdit = (item: IItem) => {
		setEditingId(item.id);
		setFormData(item);
		reset({ value: item.value });
	};

	const handleCancel = () => {
		setEditingId(null);
		setFormData(null);
		reset();
	};

	const handleSave = async (data: OtherFormData) => {
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
				return;
			}

			toast.success('Success!', {
				description: 'The team has been updated successfully',
			});

			setEditingId(null);
			setFormData(null);
			window.location.reload();
		} catch (error) {
			console.error('An unknown error occurred:', error);
			toast.error('An unknown error occurred.');
		}
	};

	const handleDelete = async (item: IItem) => {
		if (!confirm('Are you sure you want to delete this item?')) return;

		try {
			const response = await fetch(`${api}/delete/${slug}/${item.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'x-auth-token': `${token}`,
				},
			});

			if (!response.ok) {
				const errText = await response.json();
				toast.error(errText.message || 'An error occurred.');
				return;
			}

			toast.success('Success!', {
				description: 'Item deleted successfully',
			});

			window.location.reload();
		} catch (error) {
			console.error('An error occurred:', error);
			toast.error('An error occurred.');
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
			<CardWrapper title={slug.toUpperCase()}>
				<div className="w-full max-w-3xl mx-auto">
					<div className="space-y-4 sm:space-y-6">
						{items.map((i: IItem) => (
							<div
								key={i.id}
								className="bg-gray-800/50 rounded-lg p-4 sm:p-6 transition-all hover:bg-gray-800/70"
							>
								<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
									<div className="flex-1">
										{editingId === i.id ? (
											<input
												type="text"
												{...register('value')}
												defaultValue={formData?.value || ''}
												className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-lg"
											/>
										) : (
											<h3 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
												{i.value}
											</h3>
										)}
									</div>

									{isAdmin && (
										<div className="flex justify-center sm:justify-end gap-2 sm:gap-3">
											{editingId === i.id ? (
												<div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
													<button
														onClick={handleCancel}
														className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm sm:text-base"
													>
														Cancel
													</button>
													<button
														onClick={handleSubmit(handleSave)}
														className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all text-sm sm:text-base"
													>
														Save
													</button>
												</div>
											) : (
												<div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
													<button
														onClick={() => handleEdit(i)}
														className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
													>
														<MdModeEdit className="h-4 w-4 sm:h-5 sm:w-5" />
														<span className="hidden sm:inline">Edit</span>
													</button>
													<button
														onClick={() => handleDelete(i)}
														className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
													>
														<MdDelete className="h-4 w-4 sm:h-5 sm:w-5" />
														<span className="hidden sm:inline">Delete</span>
													</button>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</CardWrapper>
		</div>
	);
}

export default Other;
