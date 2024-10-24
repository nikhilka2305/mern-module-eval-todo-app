import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserLoginContext";

export default function Header({ logout }) {
	const loggeduser = useContext(UserContext);

	return (
		<div className="bg-gradient-to-r from-blue-300 to-blue-500 flex gap-8 h-28 w-screen items-center justify-between pl-10 md:pl-20 lg:pl-30 pr-32">
			<h1 className="sm:text-lg md:text-2xl lg:text-3xl font-bold">ToDo APP</h1>
			{loggeduser && (
				<h3 className="sm:text-md md:text-lg lg:text-xl">{loggeduser.user}</h3>
			)}
			<div className="userDetails  font-semibold flex items-center gap-2">
				{loggeduser && (
					<button
						className="border p-2 text-md lg:text-lg text-black border-black"
						onClick={() => logout("user", { path: "/" })}
					>
						LogOut
					</button>
				)}
			</div>
		</div>
	);
}
