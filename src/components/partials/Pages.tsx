import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

type Params = {
	total: number;
	page: string;
};

function Pages({ total, page }: Params) {
	const currentPage = parseInt(page, 10);
	const totalPages = Math.ceil(total / 5);

	const getPageNumbers = () => {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, index) => index + 1);
		}

		const pages = new Set<number>();

		pages.add(1);
		pages.add(totalPages);

		for (let i = -2; i <= 2; i++) {
			const pageNumber = currentPage + i;
			if (pageNumber > 1 && pageNumber < totalPages) {
				pages.add(pageNumber);
			}
		}

		return Array.from(pages).sort((a, b) => a - b);
	};

	const pageNumbers = getPageNumbers();

	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={`?page=${currentPage - 1}`} />
					</PaginationItem>
				)}

				{pageNumbers.map((pageNumber, index) => (
					<>
						{index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsis />
							</PaginationItem>
						)}

						<PaginationItem key={pageNumber}>
							<PaginationLink
								href={`?page=${pageNumber}`}
								isActive={pageNumber === currentPage}
							>
								{pageNumber}
							</PaginationLink>
						</PaginationItem>
					</>
				))}

				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={`?page=${currentPage + 1}`} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}

export default Pages;
