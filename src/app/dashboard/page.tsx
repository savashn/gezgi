import TeamAccordion from '@/components/accordions/TeamAccordion';
import Filter from '@/components/partials/Filter';
import Pages from '@/components/partials/Pages';
import { DecodedToken, ITeams } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type SearchParams = {
	page: string;
};

export default async function Page(props: { searchParams: SearchParams }) {
	const searchParams = await props.searchParams;
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	if (!token) {
		return notFound();
	}

	let admin: boolean;

	if (token) {
		const decodedToken = jwtDecode<DecodedToken>(token);
		admin = decodedToken.isAdmin;
	} else {
		notFound();
	}

	const res = await fetch(`${api}/main?page=${searchParams.page}`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
		cache: 'no-store',
	});

	if (!res.ok) {
		notFound();
	}

	const data = await res.json();

	type Guides = {
		id: number;
		guide: string;
	};

	return (
		<div className="flex flex-col items-center justify-center space-y-12 w-full">
			{admin && <Filter data={data.guides as Guides[]} />}

			<span className="my-6 text-2xl">{data.totalCount.count} data found:</span>

			<TeamAccordion data={admin ? (data.teams as ITeams[]) : data} />
			<Pages
				total={data.totalCount.count as number}
				page={searchParams.page || '1'}
			/>
		</div>
	);
}
