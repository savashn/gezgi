import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import Other from '@/components/Other';
import { IItem } from '@/lib/types';
import { notFound } from 'next/navigation';

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
	const slug = (await params).slug;
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value as string;

	let admin: boolean;

	if (token) {
		const decodedToken = jwtDecode<{ isAdmin: boolean; id: number }>(token);
		admin = decodedToken.isAdmin;
	} else {
		notFound();
	}

	if (admin === false) {
		notFound();
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
				<Other api={api} token={token} slug={slug} items={data} />
			</div>
		</div>
	);
}
