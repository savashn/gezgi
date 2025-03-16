import { Login } from '@/components/Login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
	const api = process.env.API as string;
	const cookieStore = await cookies();
	const token: string = cookieStore.get('x-auth-token')?.value as string;

	if (!token) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<Login api={api} />
			</div>
		);
	} else {
		return redirect('/dashboard');
	}
}
