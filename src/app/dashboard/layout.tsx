import Header from '@/components/partials/Header';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1">
				<Header />
				{children}
			</div>
		</div>
	);
}
