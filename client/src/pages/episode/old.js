// const Episode = () => {
// 	const params = useParams();

// 	const [ loading, setLoading ] = useState(true);
// 	const [ data, setData ] = useState(null);
// 	const [ error, setError ] = useState(null);

// 	let episode, recommended;
// 	if (data) {
// 		episode = data.episode;
// 		recommended = data.recommended;
// 	}

// 	const fetchEpisodeData = async () => {
// 		try {
// 			const { data } = await axios.get(`/api/episode/${params.id}?recommended=true`);
// 			setLoading(false);
// 			setData(data);
// 		} catch (error) {
// 			setLoading(false);
// 			setError(error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchEpisodeData();
// 		//eslint-disable-next-line
// 	}, []);

// 	const finalThumbnail = episode
// 		? `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}uploads/${episode.thumbnail.path}`
// 		: null;

// 	return (
// 		<LoadingErrorContent
// 			loading={loading}
// 			error={error}
// 			loadingData={<div>Loading...</div>}
// 			errorData={<div>{error}</div>}
// 		>
// 			{data && (
// 				<div className="episode">
// 					<div className="episode__wrapper">
// 						<div className="episode__image-overlay">
// 							<i class="fal fa-play-circle" />
// 							<img src={finalThumbnail} alt={episode.title} />
// 						</div>

// 						<div className="episode__head">
// 							<div className="episode__description">
// 								<h1 className="episode__title">{episode.title}</h1>
// 								<div>
// 									<span>ClubXStream</span>
// 									<span>
// 										{format(new Date(episode.publishedAt), 'dd-MM-yyyy')}
// 									</span>
// 									<span>
// 										<i className="fas fa-eye" />
// 										{episode.views}
// 									</span>
// 								</div>
// 							</div>

// 							<div className="episode__favorite" />
// 						</div>

// 						<p>{episode.info}</p>

// 						{episode.models && (
// 							<div className="episode__models">
// 								<h2>Cast</h2>
// 								<div>
// 									{episode.models.map((model) => (
// 										<Link
// 											key={model.id}
// 											to={`/models/${model.id}`}
// 											className="episode__model"
// 										>
// 											<img src={model.thumbnail} alt={model.name} />
// 											<span>{model.name}</span>
// 										</Link>
// 									))}
// 								</div>
// 							</div>
// 						)}

// 						{episode.tags && (
// 							<div className="episode__categories">
// 								<h2>Categories</h2>
// 								<div>
// 									{episode.tags.map((tag) => (
// 										<Link key={tag.id}>{tag.name}</Link>
// 									))}
// 								</div>
// 							</div>
// 						)}
// 					</div>

// 					{/* RECOMMENDED VIDEOS LOGIC */}
// 					<div className="episode__recommended">
// 						<h2>
// 							Club X | <span>Recommended Videos</span>
// 						</h2>
// 						<div className="episode__recommended--small">
// 							{recommended.map((episode) => (
// 								<RecCard key={episode.id} {...episode} />
// 							))}
// 						</div>
// 						<div className="episode__recommended--large">
// 							{recommended.map((episode) => (
// 								<EpisodeCard key={episode.id} {...episode} tags={[]} />
// 							))}
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</LoadingErrorContent>
// 	);
// };

// export default Episode;
