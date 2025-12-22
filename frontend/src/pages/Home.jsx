import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Home = () => {
	const { userData, serverUrl , setUserData} = useContext(userDataContext);
	const navigate = useNavigate();
	const handleLogOut = async () => {
		try {
			const result = await axios.get( `${serverUrl}/api/auth/logout`, {withCredentials : true}
			);
			console.log(result);
      setUserData(null)
      navigate('/signin')
		} catch (error) {
       console.log(error.message)
    }
	};

	return (
		<div className="w-full min-h-screen bg-linear-to-t relative from-black to-[#030353] flex relative justify-center items-center flex-col">
			<button 
      onClick={handleLogOut}
      className="min-w-37.5 h-15 text-black mt-7.5 font-semibold text-[19px] rounded-full bg-white absolute top-5 right-5 px-5 cursor-pointer">
				{" "}
				Logout
			</button>

			<button
				onClick={() => navigate("/customize")}
				className="min-w-37.5 h-15 text-black mt-7.5 font-semibold text-[19px] rounded-full bg-white absolute top-25 right-5 px-5 cursor-pointer"
			>
				{" "}
				Customize Your Assistant
			</button>

			<div className="w-60 h-80 flex justify-center items-center      overflow-hidden rounded-4xl ">
				<img
					className="h-full object-cover "
					src={userData?.assistantImage}
					alt=""
				/>
			</div>

			<h1 className="text-white mt-4 text-4.5 font-semibold">
				I'm {userData?.assistantName}
			</h1>
		</div>
	);
};

export default Home;
