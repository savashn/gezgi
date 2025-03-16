'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { restaurantSchema } from '@/lib/schemas';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Api, ICities } from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';

export function AddRestaurant({
	api,
	token,
	cities,
}: Api & { cities: ICities[] }) {
	const form = useForm<z.infer<typeof restaurantSchema>>({
		resolver: zodResolver(restaurantSchema),
		defaultValues: {
			restaurant: '',
			cityId: undefined,
			district: '',
			address: '',
			officer: '',
			contactOfficer: '',
			contactRestaurant: '',
		},
	});

	async function onSubmit(data: z.infer<typeof restaurantSchema>) {
		const res = await fetch(`${api}/post/restaurant`, {
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
			description: 'The housing has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title="Create a new restaurant">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
					<FormField
						control={form.control}
						name="restaurant"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Restaurant</FormLabel>
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
						name="cityId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select city" />
										</SelectTrigger>
										<SelectContent>
											{cities.map((city) => (
												<SelectItem key={city.id} value={city.id.toString()}>
													{city.city}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="district"
						render={({ field }) => (
							<FormItem>
								<FormLabel>District</FormLabel>
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
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
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

					<FormField
						control={form.control}
						name="contactRestaurant"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Restaurant</FormLabel>
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
