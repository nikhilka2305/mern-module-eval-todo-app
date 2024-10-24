import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserLoginContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function AddToDo() {
	const navigate = useNavigate();
	const [todo, setToDo] = useState({
		title: "",
	});
	const loggeduser = useContext(UserContext);
	const userToken = loggeduser ? loggeduser.token : undefined;
	const getToDoUrl = "http://localhost:3000/todo";
	const [error, setError] = useState();
	const [isLoading, setIsloading] = useState(false);

	useEffect(() => {
		if (!loggeduser) {
			setError("Invalid Token");
			navigate("/");
		}
	}, []);
	async function handleAddTodo(evt) {
		evt.preventDefault();

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${userToken}`,
			},
			body: JSON.stringify(todo),
		};
		try {
			setIsloading(true);
			const response = await fetch(getToDoUrl, options);
			const responseData = await response.json();
			if (!response.ok) {
				setError(responseData.error);
			} else {
				navigate("/todolist");
			}
		} catch (err) {
			setError("Error fetching Todos");
		}
		setIsloading(false);
	}
	return (
		<section className="w-full pt-4 mx-auto flex flex-col items-center">
			{error && (
				<h6 className="text-center text-red-600 mt-4 p-2 border-2 border-red-500 rounded-md w-5/6 mx-auto">
					{error}
				</h6>
			)}
			<h1 className="text-center text-4xl font-bold mt-16">Add Todo</h1>
			{loggeduser && (
				<h2 className="text-center text-2xl font-bold mt-16">
					{loggeduser.user}
				</h2>
			)}
			<NavLink
				className=" w-4/12 mt-8 bg-transparent text-stone-200  p-2 text-center"
				to={"/todolist"}
			>
				View All To Dos
			</NavLink>
			{isLoading && <h3>Loading....</h3>}
			{loggeduser && !isLoading && (
				<>
					<form action="" className="flex flex-col gap-2 mt-8 w-5/12">
						<label htmlFor="title">Enter Title</label>
						<input
							className="border border-gray-400 rounded-md text-lg px-2 py-1"
							type="text"
							id="title"
							name="title"
							value={todo.title}
							onChange={(evt) => {
								setToDo((curToDo) => {
									return { ...curToDo, title: evt.target.value };
								});
							}}
							required
						/>
						<button
							className="border rounded-md bg-blue-400 text-stone-200   p-2 text-center"
							onClick={handleAddTodo}
						>
							Add ToDo
						</button>
					</form>
				</>
			)}
		</section>
	);
}
