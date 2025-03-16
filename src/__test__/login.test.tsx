import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from '../components/Login';

beforeAll(() => {
	global.alert = jest.fn();

	Object.defineProperty(window, 'location', {
		value: {
			...window.location,
			reload: jest.fn(),
		},
		writable: true,
	});

	Object.defineProperty(document, 'cookie', {
		value: '',
		writable: true,
	});

	global.fetch = jest.fn();
});

describe('Login Component', () => {
	const api: string = process.env.API!;

	beforeEach(() => {
		(global.fetch as jest.Mock).mockClear();
	});

	it('renders login form with username and password inputs', () => {
		render(<Login api={api} />);

		const usernameInput = screen.getByLabelText('Username');
		const passwordInput = screen.getByLabelText('Password');

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
	});

	it('submits the form and handles successful login', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: () => Promise.resolve('mockToken'),
		});

		render(<Login api={api} />);

		const usernameInput = screen.getByLabelText('Username');
		const passwordInput = screen.getByLabelText('Password');
		const loginButton = screen.getByRole('button', { name: /login/i });

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.click(loginButton);

		document.cookie = 'x-auth-token=mockToken; max-age=86400';
		await waitFor(() =>
			expect(document.cookie).toContain('x-auth-token=mockToken'),
		);
		expect(global.location.reload).toHaveBeenCalled();
	});
});
