import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, ICities, IRestaurants } from '@/lib/types';
import RestaurantAccordion from '@/components/accordions/RestaurantsAccordion';
import { notFound } from 'next/navigation';

export default async function Page() {
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	let admin: boolean;

	if (token) {
		const decodedToken = jwtDecode<DecodedToken>(token);
		admin = decodedToken.isAdmin;
	} else {
		return <div>youre not allowed to be here</div>;
	}

	const res = await fetch(`${api}/admin/restaurants`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as {
		restaurants: IRestaurants[];
		cities: ICities[];
	};

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<RestaurantAccordion
					api={api}
					token={token}
					isAdmin={admin}
					data={data.restaurants}
					cities={data.cities}
				/>
			</div>
		</div>
	);
}
