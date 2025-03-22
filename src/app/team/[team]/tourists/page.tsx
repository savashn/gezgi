import { cookies } from 'next/headers';
import {
	INationalities,
	IGenders,
	ITourists,
	ICurrencies,
	IPaymentMethods,
	DecodedToken,
} from '@/lib/types';
import Header from '@/components/partials/Header';
import TouristAccordion from '@/components/accordions/TouristAccordion';
import { AddTourist } from '@/components/add/AddTourist';
import { notFound } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

type Team = {
	team: string;
	id: number;
};

type TeamTouristResponse = {
	team: Team;
	tourists: ITourists[];
	nationalities?: INationalities[];
	genders?: IGenders[];
	currencies?: ICurrencies[];
	paymentMethods?: IPaymentMethods[];
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

	const res = await fetch(`${api}/teams/${team}/tourists`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as TeamTouristResponse;

	return (
		<div className="flex flex-col min-h-screen">
			<div className="w-full">
				<Header />
			</div>

			<span className="text-center text-3xl mb-12">
				Tourists for{' '}
				<Link href={`/team/${data.team.team}`} className="underline">
					{data.team.team}
				</Link>
			</span>

			<div className="flex flex-col items-center justify-center space-y-16">
				<TouristAccordion
					data={data.tourists}
					api={api}
					token={token}
					nationalities={data.nationalities || []}
					genders={data.genders || []}
					currencies={data.currencies || []}
					paymentMethods={data.paymentMethods || []}
					admin={admin}
				/>

				{admin && (
					<AddTourist
						api={api}
						token={token}
						teamName={data.team.team}
						teamId={data.team.id}
						nationalities={data.nationalities || []}
						genders={data.genders || []}
						currencies={data.currencies || []}
						paymentMethods={data.paymentMethods || []}
					/>
				)}
			</div>
		</div>
	);
}
