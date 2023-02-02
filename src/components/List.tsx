import { ReactNode } from "react";
import Loader from "./Loader";

type ListPropsT<T> = {
	isLoading: boolean;
	isSuccess: boolean;
	isNextPage: boolean;
	error: string | null;
	data: T[];
	displayData: (data: T, index?: number) => React.ReactNode;
};

export default function List<P extends object>({
	isLoading,
	isSuccess,
	isNextPage,
	error,
	data,
	displayData,
}: ListPropsT<P> & { children?: ReactNode }) {
	if (isLoading && !isNextPage) return <Loader />;

	if (isSuccess && data.length === 0)
		return (
			<div className="error">Not found. Try another query parameters.</div>
		);

	if (error) return <div className="error">Error: {error}.</div>;

	return (
		<>
			<ul className="List__container">{data.map(displayData)}</ul>
			{isNextPage && isLoading && <Loader />}
		</>
	);
}

// export default withLoader(List);
