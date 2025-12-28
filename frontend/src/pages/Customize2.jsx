import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import {useNavigate} from 'react-router-dom'

const Customize2 = () => {
	const {
		userData,
		setUserData,
		backendImage,
		selectedImage,
		serverUrl,
	} = useContext(userDataContext);

	const [assistantName, setAssistantName] = useState( userData?.assistantName || "");

	const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
	const handleUpdateAssistant = async () => {
		try {
			let formData = new FormData();
       setLoading(true)
			formData.append("assistantName", assistantName);

			if (backendImage) {
				formData.append("assistantImage", backendImage);
			} else {
				formData.append("imageUrl", selectedImage);
			}

			const result = await axios.post(
				`${serverUrl}/api/user/update`,
				formData,
				{ withCredentials: true }
			);
      setLoading(false)
			console.log(result.data);
			setUserData(result.data);
		  navigate('/')
		} catch (error) {
			setLoading(false)
			console.log(error.message);
		}
	};

	return (
		<div className="w-full min-h-screen bg-linear-to-t from-black to-[#030353] flex justify-center items-center flex-col relative">
			
			<IoMdArrowBack 
			onClick={()=>navigate('/Customize')}
			className="cursor-pointer absolute top-7.25 left-7.25 text-white w-6 h-6" />
			
			<h1 className="text-white text-3xl font-semibold text-center  p-5 mb-7.25 ">
				Enter Your{" "}
				<span className="text-blue-200">
					{" "}
					Assistant Name
				</span>
			</h1>

			<input
				type="text"
				onChange={(e) =>
					setAssistantName(e.target.value)
				}
				value={assistantName}
				required
				placeholder="eg: jarvis"
				className="w-full max-w-150 h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
			/>

			{assistantName && (
				<button
					onClick={() => { handleUpdateAssistant(); }}
					disabled = {loading}
					className="min-w-37.5 h-15 px-6 cursor-pointer text-black mt-7.5 font-semibold text-[19px] rounded-full bg-white"
				>
				{!loading ?	"Finally Create Your Assistant": "Loading..."}
				</button>
			)}
		</div>
	);
};

export default Customize2;
