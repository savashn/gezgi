import Navbar from '@/components/partials/Navbar';
import Link from 'next/link';

export default function Header() {
	return (
		<header className="w-full h-24 mb-24 text-center grid grid-cols-3 items-center">
			<div className="flex items-center justify-left text-4xl h-full px-12">
				<Link href={'/dashboard'}>gezgi</Link>
			</div>
			<div className="col-span-2 flex items-center justify-center h-full px-12">
				<Navbar />
			</div>
		</header>
	);
}
