'use client';

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
	const router = useRouter();

	const handleLogout = () => {
		document.cookie =
			'x-auth-token=; Max-Age=0; path=/; secure; SameSite=Strict';
		router.push('/');
	};

	return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
