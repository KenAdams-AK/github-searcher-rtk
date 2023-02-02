import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import List from "../components/List";
import SearchPanel from "../components/SearchPanel";
import UserCard from "../components/UserCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useObserver } from "../hooks/useObserver";
import { User } from "../models/user.model";
import { fetchRepos } from "../redux/slices/reposSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

type UserParamsT = {
	id: string;
};

export default function UserPage() {
	const { id } = useParams<UserParamsT>();

	const dispatch = useAppDispatch();
	const { users } = useAppSelector((state) => state.users);
	const { isLoading, isSuccess, repos, nextUrl, error } = useAppSelector(
		(state) => state.repos
	);

	const [user, setUser] = useLocalStorage<User | null>("gitHub-user", null);
	const [query, setQuery] = useState<string>("");
	const MAX_LENGTH = 10;

	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

	// ! Used fof observer inside the component
	// const [isVisible, setIsVisible] = useState<boolean>(false);

	const itemRef = useRef<HTMLLIElement | null>(null);
	const { isVisible, observerRef } = useObserver(itemRef);

	console.log({ isVisible });

	console.log({ repos });
	console.log({ isFirstLoad });

	let filteredRepos = repos;
	if (query !== "") {
		filteredRepos = repos.filter((repo) =>
			repo.name.toLowerCase().includes(query.toLowerCase())
		);
	}

	useEffect(() => {
		if (id) {
			if (!user || user.id !== +id) {
				setUser(users.filter((user) => user.id === +id)[0]);
			}
		}
	}, [id]);

	useEffect(() => {
		if (id && user) {
			if (user.id === +id && isFirstLoad) {
				dispatch(fetchRepos({ reposLink: user.reposUrl, isFirstLoad }));
				setIsFirstLoad(false);
				console.log("firstDispatch >>>>");
			}
		}
	}, [id, user]);

	useEffect(() => {
		if (!isVisible || isFirstLoad) return;
		if (nextUrl) {
			dispatch(fetchRepos({ reposLink: nextUrl, isFirstLoad }));
			console.log("nextDispatch >>>>");
		}

		if (!nextUrl) observerRef.current?.disconnect();
	}, [isVisible]);

	// ! Implementing observer directly inside the component
	// useEffect(() => {
	// 	const observer = new IntersectionObserver(([entity]) => {
	// 		console.log("entry", entity);
	// 		console.log(itemRef.current);
	// 		setIsVisible(entity.isIntersecting);
	// 	});

	// 	if (itemRef.current) {
	// 		observer.observe(itemRef.current);
	// 	}

	// 	if (!nextUrl) observer.disconnect();

	// 	return () => observer.disconnect();
	// });

	function handleQuery(e: React.ChangeEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		setQuery(target.value);
	}

	const debouncedQuery = useMemo(() => debounce(handleQuery, 300), [query]);

	useEffect(() => {
		return () => debouncedQuery.cancel();
	}, []);

	return (
		<div className="UserPage__container">
			{user && <UserCard user={user} />}
			<SearchPanel
				placeholder="Search for Repos..."
				maxLength={MAX_LENGTH}
				handleSearch={debouncedQuery}
			/>
			<>
				<List
					isLoading={isLoading}
					isSuccess={isSuccess}
					isNextPage={!!nextUrl}
					error={error}
					data={filteredRepos}
					displayData={(repo, index) => (
						<li
							key={repo.id}
							className="repo__item"
							ref={(el) => {
								if (index === filteredRepos.length - 2) itemRef.current = el;
							}}
						>
							<a href={repo.repoUrl} target="_blank" className="repo__link">
								<div className="repo__name">{repo.name}</div>
								<div className="repo__info info">
									<div className="info__forks">{repo.forksCount} Forks</div>
									<div className="info__stars">
										{repo.stargazersCount} Stars
									</div>
								</div>
							</a>
						</li>
					)}
				/>
			</>
		</div>
	);
}
