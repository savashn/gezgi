import Footer from '@/components/partials/Footer';

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
			<Footer />
		</div>
	);
}
