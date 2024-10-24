import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserLoginContext";

export default function Home({
	handleAuthentication,
	user,
	setUser,
	authType,
	setAuthType,
	isLoading,
}) {
	const navigate = useNavigate();
	const loggeduser = useContext(UserContext);
	useEffect(() => {
		if (loggeduser) {
			navigate("/todolist");
		}
	}, [loggeduser]);

	return (
		<>
			<h3 className="text-2xl font-bold mt-8">{authType.toUpperCase()}</h3>
			<div className="auth-options ">
				{authType === "login" && (
					<button
						onClick={() => setAuthType("signup")}
						className="border p-2 rounded-lg border-blue-300 "
					>
						Don't Have an account?
					</button>
				)}
				{authType === "signup" && (
					<button
						onClick={() => setAuthType("login")}
						className="border p-2 rounded-lg border-blue-300 "
					>
						Already Have an account?
					</button>
				)}
			</div>

			<article className="flex flex-col justify-center items-center bg-blue-200 border-none rounded-lg py-8 px-4 w-4/5">
				{isLoading && <h3>Loading</h3>}
				{!isLoading && (
					<form
						action=""
						className="flex flex-col gap-4 w-full"
						onSubmit={handleAuthentication}
					>
						<label htmlFor="username" className="font-semibold">
							Enter Username
						</label>
						<input
							className="border border-gray-400 rounded-md text-lg px-2 py-1 outline-blue-500"
							type="text"
							id="username"
							name="username"
							value={user.username}
							onChange={(evt) => {
								setUser((curUser) => {
									return { ...curUser, username: evt.target.value };
								});
							}}
							required
						/>
						<label htmlFor="password" className="font-semibold">
							Enter Password
						</label>
						<input
							className="border border-gray-400 rounded-md text-lg px-2 py-1 outline-blue-500"
							type="password"
							id="password"
							name="password"
							value={user.password}
							onChange={(evt) => {
								setUser((curUser) => {
									return { ...curUser, password: evt.target.value };
								});
							}}
							required
						/>
						<button className="border rounded-md border-blue-500 text-blue-500    p-2">
							{authType.toUpperCase()}
						</button>
					</form>
				)}
			</article>
		</>
	);
}
