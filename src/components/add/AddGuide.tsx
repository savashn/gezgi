'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { guideSchema } from '@/lib/schemas';
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
import { Api, INationalities, ILanguages } from '@/lib/types';
import { CardWrapper } from '../partials/CardWrapper';
import { Checkbox } from '@/components/ui/checkbox';

export function AddGuide({
	api,
	token,
	nationalities,
	languages,
}: Api & { nationalities: INationalities[]; languages: ILanguages[] }) {
	const form = useForm<z.infer<typeof guideSchema>>({
		resolver: zodResolver(guideSchema),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			phone: '',
			passportNo: '',
			birth: '',
			nationalityId: undefined,
			languageId: undefined,
			intimate: '',
			intimatePhone: '',
			intimacy: '',
			isAdmin: false,
			password: '',
			rePassword: '',
		},
	});

	async function onSubmit(data: z.infer<typeof guideSchema>) {
		const res = await fetch(`${api}/post/guide`, {
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
			description: 'The guide has been created successfully',
		});
		window.location.reload();
	}

	return (
		<CardWrapper title="Create a new guide">
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
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
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
						name="languageId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Language</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										defaultValue={
											field.value ? field.value.toString() : undefined
										}
									>
										<SelectTrigger className="focus:border-2 focus:border-gray-600">
											<SelectValue placeholder="Select language" />
										</SelectTrigger>
										<SelectContent>
											{languages.map((language) => (
												<SelectItem
													key={language.id}
													value={language.id.toString()}
												>
													{language.language}
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
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
						name="rePassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Re-Password</FormLabel>
								<FormControl>
									<Input
										type="password"
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
						name="isAdmin"
						render={({ field }) => (
							<FormItem className="space-x-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel className="text-sm font-medium leading-none cursor-pointer">
									Select this guide as manager
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
