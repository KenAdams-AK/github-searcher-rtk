import { Navigate, Route, Routes } from "react-router";
import Header from "./layout/Header";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage";

function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path="/search" element={<SearchPage />} />
				<Route path="/user/:id" element={<UserPage />} />
				<Route path="*" element={<Navigate to="/search" />} />
			</Routes>
		</div>
	);
}

export default App;
