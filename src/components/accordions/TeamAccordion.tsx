import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ITeams } from '@/lib/types';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

type TeamAccordionProps = {
	data: ITeams[];
};

function TeamAccordion({ data }: TeamAccordionProps) {
	return (
		<div>
			<div className="flex justify-center w-[20rem] md:w-[40rem]">
				<AccordionRoot type="single" collapsible className="w-full">
					{data.map((v: ITeams) => (
						<AccordionItem
							value={v.id.toString()}
							key={v.id}
							className="w-full bg-gray-800/50 mb-2 rounded-lg overflow-hidden"
						>
							<AccordionTrigger className="font-bold text-2xl px-4 w-full">
								<div className="w-full text-left">{v.team}</div>
							</AccordionTrigger>
							<AccordionContent className="px-4 pb-4">
								<div className="grid grid-cols-[150px_1fr] gap-4 text-sm overflow-x-hidden">
									<div className="font-semibold">Team</div>
									<div className="truncate">
										<Link
											href={`/team/${v.team}`}
											className="text-blue-400 hover:text-blue-300 underline flex items-center inline-flex"
										>
											{v.team}
											<FaExternalLinkAlt className="ml-2" />
										</Link>
									</div>

									<div className="font-semibold">Starting Date:</div>
									<div className="truncate">
										{new Date(v.startsAt).toLocaleDateString('eu-EU')}
									</div>

									<div className="font-semibold">Ending Date:</div>
									<div className="truncate">
										{new Date(v.endsAt).toLocaleDateString('eu-EU')}
									</div>

									<div className="font-semibold">Tour:</div>
									<div className="truncate">
										{v.tour} ({v.tourDays} days, {v.tourNights} nights)
									</div>

									<div className="font-semibold">Guide:</div>
									<div className="truncate">{v.guide}</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</AccordionRoot>
			</div>
		</div>
	);
}

export default TeamAccordion;
