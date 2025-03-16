import { cookies } from 'next/headers';
import { IGuides, ITours, IAirports, DecodedToken } from '@/lib/types';
import { AddTeam } from '@/components/add/AddTeam';
import { jwtDecode } from 'jwt-decode';
import { notFound } from 'next/navigation';

type TeamResponse = {
	tours: ITours[];
	guides: IGuides[];
	airports: IAirports[];
};

export default async function Page() {
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	if (token) {
		const decodedToken = jwtDecode<DecodedToken>(token);
		if (decodedToken.isAdmin === false) {
			notFound();
		}
	} else {
		notFound();
	}

	const res = await fetch(`${api}/admin/team`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as TeamResponse;

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<AddTeam
					api={api}
					token={token}
					tours={data.tours}
					guides={data.guides}
					airports={data.airports}
				/>
			</div>
		</div>
	);
}
