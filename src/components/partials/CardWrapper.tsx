'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CardWrapper = {
	title: string;
	children: React.ReactNode;
};

export function CardWrapper({ title, children }: CardWrapper) {
	return (
		<Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl shadow-lg shadow-gray-600">
			<CardHeader className="text-center text-2xl font-bold mb-4">
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
