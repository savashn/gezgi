import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('x-auth-token');
	const { pathname } = request.nextUrl;

	if (!token) {
		if (!pathname.startsWith('/team/')) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}
}

export const config = {
	matcher: ['/dashboard/:path*'],
};
