import { ICities, ITours } from '@/lib/types';
import { cookies } from 'next/headers';
import TourAccordion from '@/components/accordions/TourAccordion';
import { AddTour } from '@/components/add/AddTour';
import { notFound } from 'next/navigation';

type TourResponse = {
	tours: ITours[];
	cities: ICities[];
};

export default async function Page() {
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	if (!token) {
		return <div>youre not allowed to be here</div>;
	}

	const res = await fetch(`${api}/admin/tours`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as TourResponse;

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<TourAccordion
					data={data.tours}
					api={api}
					token={token}
					cities={data.cities}
				/>
				<AddTour api={api} token={token} cities={data.cities} />
			</div>
		</div>
	);
}
