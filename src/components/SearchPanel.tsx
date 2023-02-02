import { useEffect, useRef } from "react";

type SearchPanelPropsT = {
	placeholder: string;
	maxLength: number;
	handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchPanel({
	placeholder,
	maxLength,
	handleSearch,
}: SearchPanelPropsT) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<fieldset className="SearchPanel__fieldset">
			<input
				className="SearchPanel__input"
				type="search"
				placeholder={placeholder}
				maxLength={maxLength}
				onChange={handleSearch}
				ref={inputRef}
			/>
		</fieldset>
	);
}
