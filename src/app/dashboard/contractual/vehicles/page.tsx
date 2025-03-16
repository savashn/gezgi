import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, IVehicles } from '@/lib/types';
import VehiclesAccordion from '@/components/accordions/VehiclesAccordion';
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

	const res = await fetch(`${api}/admin/vehicles`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as IVehicles[];

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<VehiclesAccordion
					api={api}
					token={token}
					isAdmin={admin}
					data={data}
				/>
			</div>
		</div>
	);
}
