import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserLoginContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export default function EditToDo() {
	const navigate = useNavigate();
	const [todo, setToDo] = useState({
		title: "",
		completed: false,
	});

	const todoId = useParams().todoid;
	const loggeduser = useContext(UserContext);
	const userToken = loggeduser ? loggeduser.token : undefined;
	const getToDoUrl = `http://localhost:3000/todo/${todoId}`;

	const [error, setError] = useState();
	const [isLoading, setIsloading] = useState(false);

	useEffect(() => {
		if (loggeduser && loggeduser.token) {
			async function getToDo() {
				const options = {
					method: "GET",
					headers: { authorization: `Bearer ${userToken}` },
				};
				try {
					setIsloading(true);
					const response = await fetch(getToDoUrl, options);
					const responseData = await response.json();
					if (!response.ok) {
						setError(responseData.message);
					} else {
						setError("");
						setToDo(responseData);
					}
				} catch (err) {
					setError("Error fetching Todos");
				}
				setIsloading(false);
			}

			getToDo();
		} else {
			setError("You Need to Login");
			navigate("/");
		}
	}, [loggeduser]);

	async function handleEditTodo(evt) {
		evt.preventDefault();

		const options = {
			method: "PATCH",
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
			<h1 className="text-center text-4xl font-bold mt-16">Edit Todo</h1>
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
					<form
						action=""
						className="flex flex-col gap-2 mt-8 w-5/12 border-none rounded-lg bg-blue-300 px-4 py-8"
					>
						<label htmlFor="title">Enter Title</label>
						<input
							className="border border-gray-400 rounded-md text-lg px-2 py-1 outline-blue-500"
							type="text"
							id="title"
							name="title"
							value={todo.title}
							disabled
						/>
						<label htmlFor="completed">Completed:</label>
						<select
							id="completed"
							name="selected"
							className="border border-gray-400 rounded-md text-lg px-2 py-1 outline-blue-500 focus:outline-blue-500"
							value={todo.completed}
							onChange={(evt) => {
								setToDo((curToDo) => {
									return { ...curToDo, completed: evt.target.value };
								});
							}}
						>
							<option value={true}>True</option>
							<option value={false} defaultChecked>
								False
							</option>
						</select>
						<button
							className="border rounded-md border-blue-200 bg-blue-400 text-blue-200   p-2 text-center"
							onClick={handleEditTodo}
						>
							Update ToDo
						</button>
					</form>
				</>
			)}
		</section>
	);
}
