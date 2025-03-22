'use client';
import { IItem } from '@/lib/types';
import React, { useState } from 'react';
import { CardWrapper } from './partials/CardWrapper';
import { toast } from 'sonner';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';

type OthersProps = {
	api: string;
	token: string;
	slug: string;
	items: IItem[];
};

function Other({ api, token, slug, items }: OthersProps) {
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editValue, setEditValue] = useState<string>('');
	const [adding, setAdding] = useState<boolean>(false);
	const [newOne, setNewOne] = useState<string>('');

	const handleEdit = (item: IItem) => {
		setEditingId(item.id);
		setEditValue(item.value);
	};

	const handleCancel = () => {
		setEditingId(null);
	};

	const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (editingId === null) return;

		try {
			const updatedData = {
				id: editingId,
				value: editValue,
			};

			const response = await fetch(`${api}/put/${slug}`, {
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
				description: 'The item has been updated successfully',
			});

			setEditingId(null);
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

	const handleAddNew = async () => {
		const postData = {
			value: newOne,
		};

		try {
			const response = await fetch(`${api}/post/${slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-auth-token': `${token}`,
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) {
				const errText = await response.json();
				toast.error(errText.message || 'An unknown error occurred.');
				return;
			}

			toast.success('Success!', {
				description: 'The new item has been added successfully',
			});

			window.location.reload();
		} catch (error) {
			console.error('An unknown error occurred:', error);
			toast.error('An unknown error occurred.');
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
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-lg"
											/>
										) : (
											<h3 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
												{i.value}
											</h3>
										)}
									</div>

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
													onClick={(e) => handleSave(e)}
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
								</div>
							</div>
						))}
					</div>
					<button
						className="w-full mt-6 flex mx-auto justify-center items-center bg-blue-600 h-[2rem] rounded-md"
						onClick={() => setAdding(!adding)}
					>
						<FaPlus />
					</button>

					<div
						className={`bg-gray-800/50 rounded-lg md:w-[40rem] flex justify-center items-center transition-all duration-300 ease-in-out overflow-hidden ${adding ? 'max-h-[2000px] opacity-100 mt-6 p-4 sm:p-6' : 'max-h-0 opacity-0'}`}
					>
						<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
							<div className="flex-1">
								<input
									type="text"
									value={newOne}
									placeholder="Add new"
									onChange={(e) => setNewOne(e.target.value)}
									className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-lg"
								/>
							</div>

							<div className="flex justify-center sm:justify-end gap-2 sm:gap-3">
								<div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
									<button
										onClick={() => setAdding(false)}
										className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm sm:text-base"
									>
										Cancel
									</button>
									<button
										onClick={() => handleAddNew()}
										className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all text-sm sm:text-base"
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardWrapper>
		</div>
	);
}

export default Other;
