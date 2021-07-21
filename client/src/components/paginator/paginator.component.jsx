import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './paginator.styles.scss';

const genArrayRange = (x, y) => {
	let arr = [];
	for (let i = x; i <= y; i++) {
		arr.push(i);
	}
	return arr;
};

const Paginator = ({ totalPages, currentPage }) => {
	const location = useLocation();
	const splitted = location.search.split(/(\?|&)/);
	const filtered = splitted
		.filter((x) => x !== '' && x !== '&' && x !== '?')
		.filter((x) => !x.startsWith('page='));
	const currentExtractedUrl = `${location.pathname}?${filtered.join('&')}&page`;

	let pagesToShow;
	if (totalPages < 7) pagesToShow = genArrayRange(1, currentPage);
	else if (currentPage <= 4) pagesToShow = [ ...genArrayRange(1, 6), totalPages ];
	else pagesToShow = [ 1, ...genArrayRange(currentPage - 2, currentPage + 2), totalPages ];

	return (
		<div className="paginator">
			<div className="paginator__pages">
				{pagesToShow.map((page) => (
					<Link
						key={page}
						to={`${currentExtractedUrl}=${page}`}
						className={`paginator__page ${currentPage === page ? 'current' : ''}`}
					>
						{page}
					</Link>
				))}
			</div>
		</div>
	);
};

export default Paginator;
