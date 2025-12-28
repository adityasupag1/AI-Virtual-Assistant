import React, { createContext, useEffect, useState } from "react";
export const userDataContext = createContext();
import axios  from "axios";

const UserContext = ({ children }) => {

	const serverUrl = "https://ai-virtual-assistant-qn0m.onrender.com/";
	const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
	const [frontendImage, setFrontendImage] = useState(null);
	const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] =useState(null)
	

	const handleCurrentUser = async () => {
  try {
    const result = await axios.get(
      `${serverUrl}/api/user/current`,
      { withCredentials: true }
    );
    setUserData(result.data);
  } catch (error) {
    setUserData(null);
  } finally {
    setLoading(false);
  }
};

const getGeminiResponse = async (command)=>{
 try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials: true})
       return result.data;
 } catch (error) {
   console.log(error.message)
 }
}

	useEffect(() => {
		handleCurrentUser();
	}, []);

	const value = {
  serverUrl,
  userData,
  setUserData,
  loading,
  frontendImage,
  setFrontendImage,
  backendImage,
  setBackendImage,
  selectedImage,
  setSelectedImage,
  getGeminiResponse
};


	return (
		<div>
			<userDataContext.Provider value={value}>
				{children}
			</userDataContext.Provider>
		</div>
	);
};

export default UserContext;
