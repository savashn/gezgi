import Navbar from '@/components/partials/Navbar';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { DecodedToken } from '@/lib/types';
import LogoutButton from '@/components/partials/LogoutButton';

export default async function Header() {
	const cookieStore = await cookies();
	const token = cookieStore.get('x-auth-token')?.value;

	const decodedToken = jwtDecode<DecodedToken>(token as string);
	const admin: boolean = decodedToken.isAdmin;

	return (
		<header className="w-full h-24 mb-24 text-center grid grid-cols-3 items-center">
			<div className="flex items-center justify-left text-4xl h-full px-12">
				<Link href={'/dashboard'}>gezgi</Link>
			</div>
			{admin ? (
				<div className="col-span-2 flex items-center justify-center h-full px-12">
					<Navbar />
				</div>
			) : (
				<div className="col-span-2 flex justify-end items-right w-full h-full px-12 text-xl">
					<LogoutButton />
				</div>
			)}
		</header>
	);
}
