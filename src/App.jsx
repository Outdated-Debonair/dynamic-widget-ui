import FeedbackWidget from "./FeedbackWidget.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
	
	return (
		<Router>
			<Routes>
				<Route path="/" element={<FeedbackWidget />} />
				<Route path="/admin" element={<AdminDashboard  />} />
			</Routes>
		</Router>
	);
};

export default App;
