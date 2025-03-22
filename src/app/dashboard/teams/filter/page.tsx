import TeamAccordion from '@/components/accordions/TeamAccordion';
import Pages from '@/components/partials/Pages';
import { ITeams } from '@/lib/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type SearchParams = {
	guide?: string;
	startDate?: string;
	endDate?: string;
	page?: string;
};

type Data = {
	teams: ITeams[];
	totalCount: number;
};

export default async function Page(props: {
	searchParams: Promise<SearchParams>;
}) {
	const searchParams = await props.searchParams;
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	if (!token) {
		return notFound();
	}

	const queryString = Object.entries(searchParams)
		.map(([key, value]) => {
			if (Array.isArray(value)) {
				return value
					.map(
						(item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
					)
					.join('&');
			}
			return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		})
		.join('&');

	const res = await fetch(`${api}/filter?${queryString}`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as Data;

	return (
		<div className="flex flex-col items-center justify-center space-y-12 w-full">
			<TeamAccordion data={data.teams} />
			<Pages
				total={data.totalCount as number}
				page={searchParams.page || '1'}
			/>
		</div>
	);
}
