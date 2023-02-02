import { ComponentType } from "react";
import Loader from "../components/Loader";

type WithLoaderPropsT = {
	isLoading: boolean;
};

export const withLoader = <P extends object>(
	Component: ComponentType<P>
): ComponentType<P & WithLoaderPropsT> => {
	return function ({ isLoading, ...props }: WithLoaderPropsT) {
		return isLoading ? <Loader /> : <Component {...(props as P)} />;
	};
};
