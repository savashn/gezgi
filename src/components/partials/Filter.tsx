'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

type Guide = {
	id: number;
	guide: string;
};

type FilterProps = {
	data: Guide[] | null;
};

export default function Filter({ data }: FilterProps) {
	const [searchInput, setSearchInput] = useState<string>('');
	const [filters, setFilters] = useState({
		guide: '',
		startDate: '',
		endDate: '',
	});

	const router = useRouter();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = () => {
		if (!searchInput.trim()) return;
		router.push(`/team/${searchInput.toUpperCase()}`);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const queryParams = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value) {
				queryParams.append(key, value);
			}
		});

		const queryString = queryParams.toString();
		router.push(`/dashboard/teams/filter?${queryString}`);
	};

	return (
		<div className="w-full max-w-2xl mx-auto space-y-6 px-4">
			<div className="flex items-center bg-gray-800/80 rounded-lg p-3">
				<input
					type="text"
					placeholder="Search team..."
					className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<button
					onClick={handleSearch}
					className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
				>
					<FaSearch className="text-white text-xl" />
				</button>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-gray-800/80 p-5 rounded-lg flex flex-col gap-4"
			>
				<div className="flex flex-col">
					<label className="text-gray-300 text-sm mb-1">Guide</label>
					<select
						name="guide"
						value={filters.guide}
						onChange={handleChange}
						className="w-full px-4 py-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select a guide</option>
						{data?.map((guide) => (
							<option key={guide.id} value={guide.id.toString()}>
								{guide.guide}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<label className="text-gray-300 text-sm mb-1">Since</label>
						<input
							type="date"
							name="startDate"
							value={filters.startDate}
							onChange={handleChange}
							className="px-4 py-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-gray-300 text-sm mb-1">Until</label>
						<input
							type="date"
							name="endDate"
							value={filters.endDate}
							onChange={handleChange}
							className="px-4 py-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all text-lg"
				>
					Apply Filters
				</button>
			</form>
		</div>
	);
}
