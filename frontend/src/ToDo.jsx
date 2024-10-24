import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserLoginContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal";
import Form from "./Form";

export default function ToDo() {
	const modal = useRef();
	const navigate = useNavigate();
	const todoId = useParams().todoid;
	const loggeduser = useContext(UserContext);
	const getToDoUrl = `http://localhost:3000/todo/${todoId}`;
	const [error, setError] = useState();
	const [todo, setToDo] = useState();
	const [isLoading, setIsloading] = useState(false);

	const userToken = loggeduser ? loggeduser.token : undefined;

	useEffect(() => {
		if (loggeduser && loggeduser.token) {
			async function fetchTodo() {
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
					setError("Error fetching Todo");
				}
				setIsloading(false);
			}

			fetchTodo();
		} else {
			setError("You Need to Login");
			modal.current.close();
			navigate("/");
		}
	}, [loggeduser]);

	async function handleDeleteTodo() {
		const options = {
			method: "DELETE",
			headers: { authorization: `Bearer ${userToken}` },
		};

		try {
			setIsloading(true);
			const response = await fetch(getToDoUrl, options);

			if (!response.ok) {
				setError("Error deleting data");
			} else {
				modal.current.close();
				navigate("/todolist");
			}
		} catch (err) {
			setError("Error deleting Todo");
		}
		setIsloading(false);
	}

	const handleModalDelete = () => {
		modal.current.open();
	};
	const handleModalCancel = () => {
		modal.current.close();
	};

	return (
		<section className="w-full pt-4 mx-auto flex flex-col items-center">
			{error && (
				<h6 className="text-center text-red-600 mt-4 p-2 border-2 border-red-500 rounded-md w-5/6 mx-auto">
					{error}
				</h6>
			)}
			<h1 className="text-center text-4xl font-bold mt-16">View Single Todo</h1>
			<NavLink
				className=" w-4/12 mt-8 bg-transparent text-stone-200  p-2 text-center"
				to={"/todolist"}
			>
				View All To Dos
			</NavLink>
			{loggeduser && (
				<h2 className="text-center text-2xl font-bold mt-8">
					{loggeduser.user}
				</h2>
			)}
			{isLoading && <h3>Loading....</h3>}
			{loggeduser && !isLoading && todo && (
				<div className="drop-shadow-xl w-3/4 border border-blue-600 rounded-md p-4 my-2   text-center flex justify-between align-items-center">
					<div className="content flex flex-col gap-4">
						<h3 className="text-3xl font-semibold">Title: {todo.title}</h3>
						<p className="text-3xl font-semibold">
							Completed: {todo.completed.toString()}
						</p>
					</div>
					<div className="modify my-auto flex items-center gap-4">
						<NavLink to={`/todo/${todo._id}/edit`}>
							<p className="text-lg font-semibold  ">Edit</p>
						</NavLink>
						<p
							className="text-lg font-semibold cursor-pointer"
							onClick={handleModalDelete}
						>
							Delete
						</p>
					</div>
				</div>
			)}
			{loggeduser && (
				<NavLink
					className=" w-4/12 mt-8 border border-blue-200 rounded-md bg-blue-400 text-blue-200   p-2 text-center"
					to={"/addtodo"}
				>
					Add To Do
				</NavLink>
			)}
			<Modal
				ref={modal}
				handleModalStateClose={() => {
					modal.current.close();
				}}
			>
				<aside className="w-full flex flex-col">
					<h3 className="w-full">Are you sure to delete this todo?</h3>
					<div className="button-group flex justify-between items-center mt-4">
						<button
							className="p-2 border rounded-md   min-w-24"
							onClick={handleDeleteTodo}
						>
							Ok
						</button>
						<button
							onClick={handleModalCancel}
							className="p-2 border rounded-md   min-w-24"
						>
							Cancel
						</button>
					</div>
				</aside>
			</Modal>
		</section>
	);
}
