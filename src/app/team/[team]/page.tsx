import { cookies } from 'next/headers';
import {
	ITeam,
	ITours,
	IGuides,
	IAirports,
	DecodedToken,
	IActivities,
	IRestaurants,
	IVehicles,
	IHousings,
} from '@/lib/types';
import Team from '@/components/Team';
import { jwtDecode } from 'jwt-decode';
import Header from '@/components/partials/Header';
import { notFound } from 'next/navigation';

type TeamResponse = {
	team: ITeam;
	activities?: IActivities[];
	tours?: ITours[];
	guides?: IGuides[];
	airports?: IAirports[];
	restaurants?: IRestaurants[];
	vehicles?: IVehicles[];
	housings?: IHousings[];
};

type PageProps = {
	params: Promise<{ team: string }>;
};

export default async function Page({ params }: PageProps) {
	const team = (await params).team;
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	let admin: boolean = false;

	if (token) {
		const decodedToken = jwtDecode<DecodedToken>(token);
		admin = decodedToken.isAdmin;
	}

	const res = await fetch(`${api}/teams/${team}`, {
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
			<div className="flex flex-col min-h-screen">
				{token ? (
					<div className="flex-1">
						<Header />
					</div>
				) : (
					<div className="mt-12"></div>
				)}

				<div className="items-center justify-center w-full space-y-12">
					<Team
						api={api}
						token={token}
						team={data.team}
						tours={data.tours}
						guides={data.guides}
						airports={data.airports}
						slug={team}
						isAdmin={admin}
						restaurants={data.restaurants}
						vehicles={data.vehicles}
						housings={data.housings}
						activities={data.activities}
					/>
				</div>
			</div>
		</div>
	);
}
