import { debounce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import List from "../components/List";
import SearchPanel from "../components/SearchPanel";
import { useObserver } from "../hooks/useObserver";
import { fetchUsers } from "../redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function SearchPage() {
	const dispatch = useAppDispatch();
	const { isLoading, isSuccess, users, nextUrl, error } = useAppSelector(
		(state) => state.users
	);

	const [query, setQuery] = useState<string>("");
	const MAX_LENGTH = 10;

	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

	const itemRef = useRef<HTMLLIElement | null>(null);
	const { isVisible, observerRef } = useObserver(itemRef);

	console.log({ users });

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		setQuery(target.value);
		setIsFirstLoad(true);
	}

	const debouncedSearch = useMemo(() => debounce(handleSearch, 800), [query]);

	useEffect(() => {
		if (!isFirstLoad) return;
		if (users.length > 0 && query.length === 0) return;
		dispatch(fetchUsers({ query, isFirstLoad }));
		setIsFirstLoad(false);
		console.log("firstDispatch >>>>");
		return () => {
			debouncedSearch.cancel();
		};

		// ! Abort dispatch
		// const promise = dispatch(fetchUsers(query));
		// return () => promise.abort();
	}, [query, isFirstLoad]);

	useEffect(() => {
		if (!isVisible || isFirstLoad) return;
		if (nextUrl) {
			dispatch(fetchUsers({ query: nextUrl, isFirstLoad }));
			console.log("nextDispatch >>>>");
		}

		if (!nextUrl) observerRef.current?.disconnect();
	}, [isVisible]);

	return (
		<div className="SearchPage__container">
			<SearchPanel
				placeholder="Search for Users..."
				maxLength={MAX_LENGTH}
				handleSearch={debouncedSearch}
			/>
			<List
				isLoading={isLoading}
				isSuccess={isSuccess}
				isNextPage={!!nextUrl}
				error={error}
				data={users}
				displayData={(user, index) => (
					<li
						key={user.id}
						className="user__item"
						ref={(el) => {
							if (index === users.length - 1) itemRef.current = el;
						}}
					>
						<Link to={`/user/${user.id}`} className="user__link link">
							<div className="user__image">
								<img src={user.avatarUrl} alt="photo" />
							</div>
							<div className="user__name">{user.name || user.login}</div>
							<div className="user__repos">Repo: {user.publicRepos}</div>
						</Link>
					</li>
				)}
			/>
		</div>
	);
}
