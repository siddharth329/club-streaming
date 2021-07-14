import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
	const location = useLocation();
	useLayoutEffect(() => window.scrollTo(0, 0), [ location.pathname ]);
	return null;
}

export default ScrollToTop;
