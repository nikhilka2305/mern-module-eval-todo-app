import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserLoginContext";
import { NavLink, useNavigate } from "react-router-dom";

// Default values shown

export default function ViewToDo() {
	const navigate = useNavigate();
	const loggeduser = useContext(UserContext);
	const getToDoUrl = "http://localhost:3000/todo";
	const [error, setError] = useState();
	const [todolist, setToDoList] = useState([]);
	const [isLoading, setIsloading] = useState(false);

	useEffect(() => {
		if (loggeduser && loggeduser.token) {
			const userToken = loggeduser.token;
			const options = {
				method: "GET",
				headers: { authorization: `Bearer ${userToken}` },
			};

			async function fetchTodo() {
				try {
					setIsloading(true);
					const response = await fetch(getToDoUrl, options);
					const responseData = await response.json();
					if (!response.ok) {
						setError(responseData.message);
					} else {
						setError("");
						setToDoList(responseData);
					}
				} catch (err) {
					setError("Error fetching Todos");
				}
				setIsloading(false);
			}

			fetchTodo();
		} else {
			setError("You Need to Login");

			navigate("/");
		}
	}, [loggeduser]);
	return (
		<section className="w-full pt-4 mx-auto flex flex-col items-center">
			{error && (
				<h6 className="text-center text-red-600 mt-4 p-2 border-2 border-red-500 rounded-md w-5/6 mx-auto">
					{error}
				</h6>
			)}
			<h1 className="text-center text-4xl font-bold mt-16">View ToDos</h1>
			{loggeduser && (
				<h2 className="text-center text-2xl font-bold mt-16">
					{loggeduser.user}
				</h2>
			)}
			{isLoading && <h3>Loading....</h3>}

			{!todolist.length && !isLoading && (
				<h3 className="text-xl p-4 font-semibold">You don't have any ToDos</h3>
			)}
			{!error && !isLoading && loggeduser && todolist.length > 0 && (
				<ul className="mx-auto border p-4 rounded-lg border-blue-700 bg-blue-200 w-4/6 mt-8">
					{todolist.map((todo) => {
						return (
							<li
								key={todo._id}
								className="w-100 border border-blue-600 rounded-md p-2 my-2   text-center"
							>
								<NavLink to={`/todo/${todo._id}`}>
									<h3>Title: {todo.title}</h3>
									<p>Completed: {todo.completed.toString()}</p>
								</NavLink>
							</li>
						);
					})}
				</ul>
			)}
			{!error && loggeduser && (
				<NavLink
					className=" w-4/12 mt-8 border rounded-md bg-blue-400 text-blue-200   p-2 text-center"
					to={"/addtodo"}
				>
					Add To Do
				</NavLink>
			)}
		</section>
	);
}
