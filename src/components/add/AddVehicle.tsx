'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { vehicleSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Api } from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';

export function AddVehicle({ api, token }: Api) {
	const form = useForm<z.infer<typeof vehicleSchema>>({
		resolver: zodResolver(vehicleSchema),
		defaultValues: {
			company: '',
			contactCompany: '',
			officer: '',
			contactOfficer: '',
		},
	});

	async function onSubmit(data: z.infer<typeof vehicleSchema>) {
		const res = await fetch(`${api}/post/vehicles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': `${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const errText = await res.json();
			toast.error(errText.message || 'An unknown error occurred.');
			return;
		}

		toast.success('Success!', {
			description: 'The vehicle has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title="Create a new vehicle">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
					<FormField
						control={form.control}
						name="company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company</FormLabel>
								<FormControl>
									<Input
										className="focus:border-2 focus:border-gray-600"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contactCompany"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Company</FormLabel>
								<FormControl>
									<Input
										className="focus:border-2 focus:border-gray-600"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="officer"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Officer</FormLabel>
								<FormControl>
									<Input
										className="focus:border-2 focus:border-gray-600"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contactOfficer"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Officer</FormLabel>
								<FormControl>
									<Input
										className="focus:border-2 focus:border-gray-600"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full hover:bg-gray-300">
						Submit
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}
