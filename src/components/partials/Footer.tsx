import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
	return (
		<footer className="w-full text-center p-4 mt-16 bg-gray-900 text-white flex flex-col items-center justify-center">
			<span className="text-xl">gezgi &copy; 2025 - all rights reserved.</span>

			<Link href={'https://github.com/savashn'} className="mt-6 mb-3 text-3xl">
				<FaGithub />
			</Link>
		</footer>
	);
}
