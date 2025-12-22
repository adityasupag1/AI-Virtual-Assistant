import React, { createContext, useEffect, useState } from "react";
export const userDataContext = createContext();
import axios  from "axios";

const UserContext = ({ children }) => {

	const serverUrl = "http://localhost:8000";
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
  setSelectedImage
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
