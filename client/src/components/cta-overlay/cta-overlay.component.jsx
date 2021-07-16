import axios from 'axios';
import React, { useEffect, useState } from 'react';
const CtaOverlay = () => {
	const [ shown, setShown ] = useState(false);
	const [ overlay, setOverlay ] = useState(null);

	const fetchBanner = async () => {
		try {
			const { data } = await axios.get('/api/banner/CTA_OVERLAY');
			if (data) {
				setOverlay(data[0]);
				setShown(true);
			}
		} catch (error) {
			setShown(false);
		}
	};

	useEffect(() => fetchBanner(), []);

	return shown ? (
		<div className="ctaoverlay">
			<a href={overlay.redirect}>
				<img src={overlay.path} alt="overlay banner" />
			</a>
		</div>
	) : null;
};
export default CtaOverlay;
