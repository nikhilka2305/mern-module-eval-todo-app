import "./App.css";
import Form from "./Form";
import Home from "./Home";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";
import { CookiesProvider, useCookies, Cookies } from "react-cookie";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { UserContext } from "./UserLoginContext";
import ViewToDo from "./ViewToDo";
import AddToDo from "./AddToDo";
import ToDo from "./ToDo";
import EditToDo from "./EditToDo";
import Header from "./Header";

function App() {
	const modal = useRef();
	const [authType, setAuthType] = useState("login");
	const [errorMessage, setErrorMessage] = useState();
	const [loggeduser, setLoggedUser] = useState();
	const [cookies, setCookies, removeCookies] = useCookies(["user"]);
	const [isLoading, setIsloading] = useState(false);

	useEffect(() => {
		setLoggedUser(cookies.user);
	}, [cookies]);

	//
	let heading, buttonText;
	let authURL;
	const [user, setUser] = useState({
		username: "",
		password: "",
	});
	if (authType === "login") {
		heading = buttonText = "Log In";
		authURL = "http://localhost:3000/auth/login";
	} else {
		heading = buttonText = "Sign Up";
		authURL = "http://localhost:3000/auth/register";
	}

	//

	const handleLogOut = () => {
		removeCookies("user", { path: "/" });
	};

	const handleModalStateClose = () => {
		modal.current.close();
	};

	async function handleAuthentication(evt) {
		evt.preventDefault();

		const options = {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		};

		try {
			setIsloading(true);
			const response = await fetch(authURL, options);
			const responseData = await response.json();
			if (!response.ok) {
				setErrorMessage(responseData.error);
			} else {
				setErrorMessage("");
				setCookies("user", responseData);
				setUser({
					username: "",
					password: "",
				});
			}
		} catch (err) {
			setErrorMessage("Error sending Request to API");
		}
		setIsloading(false);
	}

	return (
		<CookiesProvider defaultSetOptions={{ path: "/" }}>
			<UserContext.Provider value={loggeduser}>
				<Header logout={handleLogOut} />
				<main className="main bg-gradient-to-r from-blue-300 to-blue-500 flex flex-col gap-8 min-h-screen h-full items-center w-screen">
					{errorMessage && (
						<h6 className="text-center text-red-600 mt-4 p-2 border-2 border-red-500 rounded-md w-1/3">
							{errorMessage}
						</h6>
					)}
					<Router>
						<Routes>
							<Route
								path="/"
								element={
									<Home
										handleAuthentication={handleAuthentication}
										loggeduser={loggeduser}
										user={user}
										setUser={setUser}
										authType={authType}
										setAuthType={setAuthType}
										isLoading={isLoading}
									></Home>
								}
							/>

							<Route path="/todolist" element={<ViewToDo />} />
							<Route path="/addtodo" element={<AddToDo />} />
							<Route path="/todo/:todoid" element={<ToDo />} />
							<Route path="/todo/:todoid/edit" element={<EditToDo />} />

							<Route path="*" element={<Navigate replace to="/" />} />
						</Routes>
					</Router>
				</main>
			</UserContext.Provider>
			<Modal ref={modal} handleModalStateClose={handleModalStateClose}>
				<Form
					handleAuthentication={handleAuthentication}
					closeModal={handleModalStateClose}
					user={user}
					setUser={setUser}
					heading={heading}
					buttonText={buttonText}
				/>
			</Modal>
		</CookiesProvider>
	);
}

export default App;
