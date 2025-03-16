import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="grid place-items-center m-auto min-h-screen">
			<Skeleton className="m-auto w-[20rem] h-[30vh] rounded-full" />
		</div>
	);
}
