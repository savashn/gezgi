'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { touristSchema } from '@/lib/schemas';
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
import {
	Api,
	INationalities,
	IGenders,
	ICurrencies,
	IPaymentMethods,
} from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';
import { Checkbox } from '@/components/ui/checkbox';

export function AddTourist({
	api,
	token,
	teamName,
	teamId,
	nationalities,
	genders,
	currencies,
	paymentMethods,
}: Api & {
	nationalities: INationalities[];
	genders: IGenders[];
	currencies: ICurrencies[];
	paymentMethods: IPaymentMethods[];
	teamName: string;
	teamId: number;
}) {
	const form = useForm<z.infer<typeof touristSchema>>({
		resolver: zodResolver(touristSchema),
		defaultValues: {
			name: '',
			birth: '',
			genderId: undefined,
			nationalityId: undefined,
			phone: '',
			email: '',
			passportNo: '',
			intimate: '',
			intimatePhone: '',
			intimacy: '',
			address: '',
			amount: undefined,
			currencyId: undefined,
			paymentMethodId: undefined,
			isPayed: false,
			teamId: teamId,
		},
	});

	async function onSubmit(data: z.infer<typeof touristSchema>) {
		const res = await fetch(`${api}/post/tourist`, {
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
			description: 'The tourist has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title={`Create a new tourist for ${teamName}`}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
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
						name="genderId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											{genders.map((gender) => (
												<SelectItem
													key={gender.id}
													value={gender.id.toString()}
												>
													{gender.gender}
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
						name="nationalityId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nationality</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select nationality" />
										</SelectTrigger>
										<SelectContent>
											{nationalities.map((nationality) => (
												<SelectItem
													key={nationality.id}
													value={nationality.id.toString()}
												>
													{nationality.nationality}
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
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
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
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
						name="passportNo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Passport No</FormLabel>
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
						name="birth"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Birth (YYYY-MM-DD)</FormLabel>
								<FormControl>
									<input
										type="date"
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
						name="intimate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Intimate</FormLabel>
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
						name="intimatePhone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Intimate Phone</FormLabel>
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
						name="intimacy"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Intimacy</FormLabel>
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
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input
										type="number"
										min="0"
										className="focus:border-2 focus:border-gray-600"
										{...field}
										value={field.value ?? ''}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === '' ? undefined : Number(value));
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="currencyId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select a currency" />
										</SelectTrigger>
										<SelectContent>
											{currencies.map((currency) => (
												<SelectItem
													key={currency.id}
													value={currency.id.toString()}
												>
													{currency.currency}
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
						name="paymentMethodId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select a payment method" />
										</SelectTrigger>
										<SelectContent>
											{paymentMethods.map((method) => (
												<SelectItem
													key={method.id}
													value={method.id.toString()}
												>
													{method.method}
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
						name="isPayed"
						render={({ field }) => (
							<FormItem className="space-x-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel className="text-sm font-medium leading-none cursor-pointer">
									Select if the amount is payed
								</FormLabel>
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
