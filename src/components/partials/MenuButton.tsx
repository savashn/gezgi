type MenuButtonProps = {
	isOpen: boolean;
	onClick: () => void;
};

export function MenuButton({ isOpen, onClick }: MenuButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center justify-center w-8 h-8 focus:outline-none"
			aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
		>
			<div className="relative w-6 h-6">
				<span
					className={`absolute left-0 h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
						isOpen ? 'top-[11px] rotate-45' : 'top-0'
					}`}
				/>
				<span
					className={`absolute left-0 top-[11px] h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
						isOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
					}`}
				/>
				<span
					className={`absolute left-0 h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
						isOpen ? 'top-[11px] -rotate-45' : 'top-[22px]'
					}`}
				/>
			</div>
		</button>
	);
}
