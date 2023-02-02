import { Component, ErrorInfo, ReactNode } from "react";

type PropsT = {
	children?: ReactNode;
};

type StateT = {
	hasError: boolean;
};

class ErrorBoundary extends Component<PropsT, StateT> {
	// constructor(props: PropsT) {
	// 	super(props);
	// 	this.state = {
	// 		hasError: false,
	// 	};
	// }

	public state: StateT = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): StateT {
		return {
			hasError: true,
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Uncaught error: ", error, errorInfo);
	}

	public render(): ReactNode {
		if (this.state.hasError) {
			return <h1 className="error">Sorry... there was an error</h1>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
