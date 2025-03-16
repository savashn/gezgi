'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { teamSchema } from '@/lib/schemas';
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
import { IGuides, ITours, IAirports } from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';

type AddTeamProps = {
	api: string;
	token: string;
	tours: ITours[];
	guides: IGuides[];
	airports: IAirports[];
};

export function AddTeam({ api, token, tours, guides, airports }: AddTeamProps) {
	const form = useForm<z.infer<typeof teamSchema>>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			team: '',
			tourId: undefined,
			startsAt: '',
			endsAt: '',
			guideId: undefined,
			flightOutwardNo: '',
			flightOutwardDeparture: '',
			flightOutwardDepartureAirport: undefined,
			flightOutwardLanding: '',
			flightOutwardLandingAirport: undefined,
			flightReturnNo: '',
			flightReturnDeparture: '',
			flightReturnDepartureAirport: undefined,
			flightReturnLanding: '',
			flightReturnLandingAirport: undefined,
		},
	});

	async function onSubmit(data: z.infer<typeof teamSchema>) {
		const res = await fetch(`${api}/post/team`, {
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
			console.error(errText);
			return;
		}

		toast.success('Success!', {
			description: 'The team has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title="Create a new team">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
					<FormField
						control={form.control}
						name="team"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Team</FormLabel>
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
						name="tourId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tour</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select tour" />
										</SelectTrigger>
										<SelectContent>
											{tours.map((tour) => (
												<SelectItem key={tour.id} value={tour.id.toString()}>
													{tour.tour} ({tour.numberOfNights} nights,{' '}
													{tour.numberOfDays} days)
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
						name="startsAt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Starts At</FormLabel>
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
						name="endsAt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ends At</FormLabel>
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
						name="guideId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Guide</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select guide" />
										</SelectTrigger>
										<SelectContent>
											{guides.map((guide) => (
												<SelectItem key={guide.id} value={guide.id.toString()}>
													{guide.name}
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
						name="flightOutwardNo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Outward No</FormLabel>
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
						name="flightOutwardDeparture"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Outward Departure</FormLabel>
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
						name="flightOutwardDepartureAirport"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Outward Departure Airport</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select airport" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
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

					<FormField
						control={form.control}
						name="flightOutwardLanding"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Outward Landing</FormLabel>
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
						name="flightOutwardLandingAirport"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Outward Landing Airport</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select airport" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
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

					<FormField
						control={form.control}
						name="flightReturnNo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Return No</FormLabel>
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
						name="flightReturnDeparture"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Return Departure</FormLabel>
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
						name="flightReturnDepartureAirport"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Return Departure Airport</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select airport" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
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

					<FormField
						control={form.control}
						name="flightReturnLanding"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Return Landing</FormLabel>
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
						name="flightReturnLandingAirport"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Flight Return Landing Airport</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select airport" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
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
