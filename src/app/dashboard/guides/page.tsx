import { AddGuide } from '@/components/add/AddGuide';
import GuideAccordion from '@/components/accordions/GuideAccordion';
import { IGuides, ILanguages, INationalities } from '@/lib/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type GuideResponse = {
	guides: IGuides[];
	languages: ILanguages[];
	nationalities: INationalities[];
};

export default async function Page() {
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	if (!token) {
		return <div>youre not allowed to be here</div>;
	}

	const res = await fetch(`${api}/admin/guides`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as GuideResponse;

	console.log(data);

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<GuideAccordion
					data={data.guides}
					api={api}
					token={token}
					nationalities={data.nationalities}
					languages={data.languages}
				/>
				<AddGuide
					api={api}
					token={token}
					nationalities={data.nationalities}
					languages={data.languages}
				/>
			</div>
		</div>
	);
}
