import React, { useContext } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

const SignIn = () => {
	const { serverUrl, userData, setUserData } =useContext(userDataContext);

	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignIn = async (e) => {
		e.preventDefault();
		setErr("");

		if (!email || !password) {
			setErr("Email and password are required");
			return;
		}

		setLoading(true);

		try {
			let result = await axios.post(
				`${serverUrl}/api/auth/login`,
				{ email, password },
				{ withCredentials: true }
			);
			setUserData(result.data)
			navigate("/"); // redirect after login
			
		} catch (error) {
			setUserData(null)
			const message =
				error?.response?.data?.message ||
				"Login failed. Please try again.";

			setErr(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="w-full h-screen bg-cover flex justify-center items-center"
			style={{ backgroundImage: `url(${bg})` }}
		>
			<form
				onSubmit={handleSignIn}
				className="w-[90%] h-150 max-w-125 bg-[#00000069] backdrop-blur shadow-lg  shadow-black flex flex-col items-center justify-center gap-5"
			>
				<h1 className="text-white mb-7.5 text-[30px] font-semibold">
					Sign to{" "}
					<span className="text-blue-400">
						Virtual Assistant
					</span>
				</h1>

				<input
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					required
					placeholder="Enter Your Email"
					className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
				/>

				<div className="w-full h-15 border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
					<input
						type={ showPassword ? "text" : "password" }
						placeholder="Enter Your Password"
						onChange={(e) => setPassword( e.target.value )	}
						required
						value={password}
						className="w-full h-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
					/>
					{!showPassword && (
						<IoEye
							className="absolute top-4.5 right-5 text-white w-6.25 h-6.25"
							onClick={() => setShowPassword( true ) } />
					)}
					{showPassword && (
						<IoEyeOff
							className="absolute top-4.5 right-5 text-white w-6.25 h-6.25"
							onClick={() => setShowPassword( false ) 	} />
					)}
				</div>

				{err && ( <p className="text-red-500 -mb-5 text-[17px]"> 	*{err} </p> )}
				
				<button
					className="min-w-37.5 h-15 text-black mt-7.5 font-semibold text-[19px] rounded-full bg-white"
					disabled={loading}
				>
					{loading ? "Loading..." : "Sign In"}
				</button>

				<p
					className="text-white text-4.25 cursor-pointer"
					onClick={() => navigate("/signup")}
				>
					Want to create an Account ?
					<span className="text-blue-400">
						{" "}
						Sign Up
					</span>
				</p>
			</form>
		</div>
	);
};

export default SignIn;
