import ReactJWPlayer from 'react-jw-player';
import axios from 'axios';
import React from 'react';

import Spinner from '../spinner';
import './player.styles.scss';

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = { streamUrl: null };
	}

	componentDidMount() {
		this.fetchStreamUrl();
	}

	fetchStreamUrl = async () => {
		const { data: { signedUrl } } = await axios.get(`/api/stream/${this.props.episodeId}`);
		this.setState({ streamUrl: signedUrl });
	};

	render() {
		return (
			<div className="player">
				{/* {this.state.streamUrl ? (
					<ReactJWPlayer
						playerId="my-unique-id-secret-nahi0bataunga"
						playerScript="https://cdn.jwplayer.com/libraries/BssAMo9Z.js"
						file={this.state.streamUrl}
					/>
				) : (
					<div className="player__fake">
						<Spinner />
					</div>
				)} */}
				<ReactJWPlayer
					playerId="my-unique-id-secret-nahi0bataunga"
					playerScript="https://cdn.jwplayer.com/libraries/BssAMo9Z.js"
					file={this.state.streamUrl ? this.state.streamUrl : null}
				/>
			</div>
		);
	}
}

export default Player;
