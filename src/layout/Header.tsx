import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="Header">
			<h1 className="Header__title">
				<Link to="/search">GitHub Searcher</Link>
			</h1>
		</header>
	);
}
