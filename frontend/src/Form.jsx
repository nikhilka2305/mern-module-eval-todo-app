import React from "react";

export default function Form({
	handleAuthentication,
	closeModal,
	user,
	setUser,
	heading,
	buttonText,
}) {
	return (
		<>
			<h3 className="text-center">{heading}</h3>
			<form action="" className="flex flex-col gap-2">
				<label htmlFor="username">Enter Username</label>
				<input
					className="border border-gray-400 rounded-md text-lg px-2 py-1"
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
				<label htmlFor="password">Enter Password</label>
				<input
					className="border border-gray-400 rounded-md text-lg px-2 py-1"
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
				<button className="border rounded-md" onClick={handleAuthentication}>
					{buttonText}
				</button>
			</form>
			<button className="border-2 rounded-md" onClick={closeModal}>
				Close
			</button>
		</>
	);
}
