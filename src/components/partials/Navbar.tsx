'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MenuButton } from '@/components/partials/MenuButton';
import { MdKeyboardArrowDown } from 'react-icons/md';
import LogoutButton from './LogoutButton';

type NavItemType = {
	href: string;
	label: string;
};

const navItems: NavItemType[] = [
	{ href: '/dashboard/teams', label: 'New Team' },
	{ href: '/dashboard/guides', label: 'Guides' },
	{ href: '/dashboard/tours', label: 'Tours' },
];

const dropdownItems: NavItemType[] = [
	{ href: '/dashboard/others/languages', label: 'Languages' },
	{ href: '/dashboard/others/payment-methods', label: 'Payment Methods' },
	{ href: '/dashboard/others/genders', label: 'Genders' },
	{ href: '/dashboard/others/airports', label: 'Airports' },
	{ href: '/dashboard/others/nationalities', label: 'Nationalities' },
	{ href: '/dashboard/others/currencies', label: 'Currencies' },
	{ href: '/dashboard/others/cities', label: 'Cities' },
];

const contractualItems: NavItemType[] = [
	{ href: '/dashboard/contractual/vehicles', label: 'Vehicles' },
	{ href: '/dashboard/contractual/housings', label: 'Housings' },
	{ href: '/dashboard/contractual/restaurants', label: 'Restaurants' },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isMobileDropdownOpen, setIsMobileDropdownOpen] =
		useState<boolean>(false);
	const [isMobileContractualOpen, setIsMobileContractualOpen] =
		useState<boolean>(false);

	return (
		<nav className="p-4 flex justify-end items-right w-full text-white">
			{/* Mobile Menu Button */}
			<div className="md:hidden ml-auto relative z-50">
				<MenuButton
					isOpen={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed inset-0 flex flex-col items-center justify-center 
					space-y-6 bg-gray-800/95 backdrop-blur-sm text-white text-lg font-semibold 
					shadow-lg transform transition-transform duration-300 
					${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden z-40`}
			>
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="hover:text-gray-300 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						{item.label}
					</Link>
				))}

				{/* Mobil Contractual Dropdown */}
				<div className="w-48">
					<button
						onClick={() => setIsMobileContractualOpen(!isMobileContractualOpen)}
						className="w-full ml-3 flex items-center justify-center gap-2 px-4 hover:text-gray-300 transition-colors"
					>
						<span>Contractual</span>
						<MdKeyboardArrowDown
							className={`h-4 transition-transform duration-200 ${isMobileContractualOpen ? 'rotate-180' : ''}`}
						/>
					</button>
					<div
						className={`mt-2 overflow-hidden transition-all duration-300 ${isMobileContractualOpen ? 'max-h-64' : 'max-h-0'}`}
					>
						{contractualItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
								onClick={() => {
									setIsMobileContractualOpen(false);
									setIsOpen(false);
								}}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* Mobil Dropdown */}
				<div className="w-48">
					<button
						onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
						className="w-full ml-3 flex items-center justify-center gap-2 px-4 hover:text-gray-300 transition-colors"
					>
						<span>Others</span>
						<MdKeyboardArrowDown
							className={`h-4 transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}
						/>
					</button>
					<div
						className={`mt-2 overflow-hidden transition-all duration-300 ${isMobileDropdownOpen ? 'max-h-64' : 'max-h-0'}`}
					>
						{dropdownItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
								onClick={() => {
									setIsMobileDropdownOpen(false);
									setIsOpen(false);
								}}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* LOGOUT */}
				<LogoutButton />
			</div>

			{/* Desktop Menu */}
			<div className="hidden md:flex space-x-6 text-lg font-medium items-center">
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="hover:text-gray-300 transition-colors"
					>
						{item.label}
					</Link>
				))}

				{/* Desktop Contractual Dropdown */}
				<div className="relative group">
					<button className="hover:text-gray-300 transition-colors flex items-center space-x-1 py-2">
						<span>Contractual</span>
						<MdKeyboardArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
					</button>
					<div
						className="absolute top-full right-0 mt-2 py-2 w-48 bg-gray-700 rounded-md shadow-lg z-50 
						opacity-0 invisible group-hover:opacity-100 group-hover:visible 
						transition-all duration-200 transform origin-top-right"
					>
						{contractualItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block px-4 py-2 text-sm hover:bg-gray-600 transition-colors"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* Desktop Dropdown */}
				<div className="relative group">
					<button className="hover:text-gray-300 transition-colors flex items-center space-x-1 py-2">
						<span>Others</span>
						<MdKeyboardArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
					</button>
					<div
						className="absolute top-full right-0 mt-2 py-2 w-48 bg-gray-700 rounded-md shadow-lg z-50 
						opacity-0 invisible group-hover:opacity-100 group-hover:visible 
						transition-all duration-200 transform origin-top-right"
					>
						{dropdownItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block px-4 py-2 text-sm hover:bg-gray-600 transition-colors"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* Logout */}
				<LogoutButton />
			</div>
		</nav>
	);
}
