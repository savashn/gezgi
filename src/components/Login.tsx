'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from './partials/CardWrapper';

export function Login({ api }: { api: string }) {
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(data: z.infer<typeof loginSchema>) {
		const res = await fetch(`${api}/post/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const text = await res.text();

		if (!res.ok) {
			if (res.status === 400) {
				toast(text);
			} else {
				toast('An error occured while login');
			}
			return;
		}

		document.cookie = `x-auth-token=${text}; max-age=86400`;

		toast('Login successful');
		window.location.reload();
	}

	return (
		<CardWrapper title="Login">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 m-auto"
				>
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

					<Button type="submit" className="w-full hover:bg-gray-300">
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}
