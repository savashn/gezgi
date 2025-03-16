'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { activitySchema } from '@/lib/schemas';
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
import { IAirports, IHousings, IRestaurants, IVehicles } from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';

type AddActivityProps = {
	api: string;
	token: string;
	teamId: number;
	airports?: IAirports[];
	restaurants?: IRestaurants[];
	vehicles?: IVehicles[];
	housings?: IHousings[];
};

export function AddActivity({
	api,
	token,
	teamId,
	airports,
	restaurants,
	vehicles,
	housings,
}: AddActivityProps) {
	const form = useForm<z.infer<typeof activitySchema>>({
		resolver: zodResolver(activitySchema),
		defaultValues: {
			activity: '',
			activityTime: '',
			teamId: teamId,
			hotelId: undefined,
			companyOfVehicleId: undefined,
			plateOfVehicle: '',
			contactOfDriver: '',
			restaurantId: undefined,
			airportId: undefined,
		},
	});

	async function onSubmit(data: z.infer<typeof activitySchema>) {
		const res = await fetch(`${api}/post/activity`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': `${token}`,
			},
			body: JSON.stringify(data),
		});

		console.log(res);

		if (!res.ok) {
			const errText = await res.json();
			console.error(errText);
			toast.error(errText.message || 'An unknown error occurred.');
			return;
		}

		toast.success('Success!', {
			description: 'The activity has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title="Create a new activity">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
					<FormField
						control={form.control}
						name="activity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Activity</FormLabel>
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
						name="activityTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Activity Time</FormLabel>
								<FormControl>
									<input
										type="datetime-local"
										className="border rounded px-2 py-1 w-full bg-transparent text-white focus:border-2 focus:border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="hotelId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Housing</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select housing" />
										</SelectTrigger>
										<SelectContent>
											{housings &&
												housings.map((housing) => (
													<SelectItem
														key={housing.id}
														value={housing.id.toString()}
													>
														{housing.housing}
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
						name="companyOfVehicleId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company of vehicle</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select company of vehicle" />
										</SelectTrigger>
										<SelectContent>
											{vehicles &&
												vehicles.map((vehicle) => (
													<SelectItem
														key={vehicle.id}
														value={vehicle.id.toString()}
													>
														{vehicle.company}
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
						name="plateOfVehicle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Plate of vehicle</FormLabel>
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
						name="contactOfDriver"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Driver&apos;s contact</FormLabel>
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
						name="restaurantId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Restaurant</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select housing" />
										</SelectTrigger>
										<SelectContent>
											{restaurants &&
												restaurants.map((restaurant) => (
													<SelectItem
														key={restaurant.id}
														value={restaurant.id.toString()}
													>
														{restaurant.restaurant}
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
						name="airportId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Airport</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select housing" />
										</SelectTrigger>
										<SelectContent>
											{airports &&
												airports.map((airport) => (
													<SelectItem
														key={airport.id}
														value={airport.id.toString()}
													>
														{airport.airport}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
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
