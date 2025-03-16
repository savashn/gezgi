import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import Other from '@/components/Other';
import { IItem } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
	const slug = (await params).slug;
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	let admin: boolean;

	if (token) {
		const decodedToken = jwtDecode<{ isAdmin: boolean; id: number }>(token);
		admin = decodedToken.isAdmin;
	} else {
		return <div>youre not allowed to be here</div>;
	}

	const res = await fetch(`${api}/admin/${slug}`, {
		method: 'GET',
		headers: {
			'x-auth-token': `${token}`,
		},
	});

	if (!res.ok) {
		notFound();
	}

	const data = (await res.json()) as IItem[];

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full space-y-12">
				<Other
					api={api}
					token={token}
					slug={slug}
					isAdmin={admin}
					items={data}
				/>
			</div>
		</div>
	);
}
