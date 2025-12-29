import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userLoggedIN, setUserLoggedIN] = useState(false);
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const [role, setRole] = useState(null);
  const [responseSubrole, setResponseSubrole] = useState(null);
  const [newSubrole, setNewSubRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailAlreadyCreated, setEmailAlreadyCreated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [allTrainer, setAllTrainer] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [error1, setError1] = useState(null);




  // const API_BASE_URL = "https://technohub.pythonanywhere.com/auth";//main
  const API_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/auth";//tahur
  // const API_BASE_URL = "https://187gwsw1-8000.inc1.devtunnels.ms/auth";//farha
  // const API_BASE_URL = "https://958cp4w5-8000.inc1.devtunnels.ms/auth";//Saba





  // Initialize auth state from localStorage    
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUserID = localStorage.getItem("userID");
    const storedRole = localStorage.getItem("role");
    const storedSubrole = localStorage.getItem("subrole");

    if (storedAccessToken && storedRefreshToken && storedUserID && storedRole) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserID(storedUserID);
      setRole(storedRole);
      setResponseSubrole(storedSubrole);
      setUserLoggedIN(true);
    }
  }, []);

  // Set up Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        const isTokenExpired =
          error.response?.status === 401 &&
          error.response?.data?.code === "token_not_valid";

        if (isTokenExpired && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await GenerateNewAccessToken();

            axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return axios(originalRequest);
          } catch (err) {
            LogoutUser();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);


  // Lazy fetch functions - only called when explicitly needed
  // fetchTrainers() - Only fetches current user's trainer profile (single trainer name)
  // Should only be called when user is a TRAINER and on trainer-specific pages
  const fetchTrainers = async () => {
    if (trainers) return; // Already fetched (trainers is a string)
    // Only fetch if user is a trainer
    if (role !== "TRAINER" && responseSubrole !== "TRAINER") return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setTrainers(response.data.first_name + " " + response.data.last_name);
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmin = async () => {
    if (admin) return; // Already fetched (admin is a string)
    // Only fetch if user is ADMIN
    if (role !== "ADMIN") return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Admin/`);
      if (response.status === 200) {
        setAdmin(
          response.data[0].user.first_name +
          " " +
          response.data[0].user.last_name
        );
      }
    } catch (error) {
      console.error("Error fetching Admin:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchAllTrainer = async () => {
  //   if (allTrainer.length > 0) return; // Already fetched
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/trainers/`);
  //     if (response.status === 200) {
  //       setAllTrainer(response.data);
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Trainers:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBatches = async () => {
    if (batches.length > 0) return; // Already fetched
    setLoadingBatches(true);
    setError1(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/batches/`);
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError1("Failed to load batches");
    } finally {
      setLoadingBatches(false);
    }
  };

  const RegisterUser = async (userData) => {
    setLoading(true);
    setUserCreatedSuccessfully(false);
    setEmailAlreadyCreated(false);
    try {
      const config = {
        headers: {
          'Content-Type': userData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/register/`,
        userData,
        config
      );


      if (response.status >= 200 && response.status < 300) {
        // window.alert('User created successfully');
        setUserCreatedSuccessfully(true);
        return { success: true, data: response.data };
      }

      return { success: false, data: response.data };

    } catch (error) {
      // Handle email exists error
      if (error.response?.data?.email?.includes('already exists')) {
        setEmailAlreadyCreated(true);
      }

      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      };

    } finally {
      setLoading(false);
    }
  };
  const LoginUser = async (userData) => {
    setLoginError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUserID(response.data.user_id);
      setResponseSubrole(response.data.subrole);    
      setRole(response.data.role);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userID", response.data.user_id);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("subrole", response.data.subrole);

      if (response.status === 200) {
        setUserLoggedIN(true);
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.non_field_errors?.[0] ||
        "Login failed. Please try again.";

      setLoginError(errorMessage);
      console.error("Login Error:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const GetUser = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/User/${userID}`);

      if (response.status === 200) {
        setUser(response.data);
        window.localStorage.setItem("first_name", user.first_name)
        window.localStorage.setItem("last_name", user.last_name)
      }


    } catch (error) {
      console.error("GetUser Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewSubrole = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/SubRole/`);

      if (response.status === 200) {
        console.log("Subroles fetched successfully:", response.data);
        setNewSubRole(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const LogoutUser = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("role");
    localStorage.removeItem("subrole");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("fcm_token");
    setUserLoggedIN(false);
    setAccessToken(null);
    setRefreshToken(null);
    setUserID(null);
    setRole(null);
    setResponseSubrole(null);
    setUser(null);
  };
  const GenerateNewAccessToken = async () => {
    if (!refreshToken) {
      LogoutUser();
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login/refresh/`, {
        refresh: refreshToken
      });

      if (response.data.access) {
        const newAccessToken = response.data.access;

        // Update local state
        setAccessToken(newAccessToken);
        // Persist
        localStorage.setItem("accessToken", newAccessToken);
        // Update global axios header immediately
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        return newAccessToken;
      }

      throw new Error("Invalid refresh response");
    } catch (error) {
      console.error("Token refresh failed:", error);
      LogoutUser();
      throw error;
    }
  };


  // Fetch user data when accessToken or userID changes (only if not already fetched)
  useEffect(() => {
    if (accessToken && userID && !user) {
      GetUser();
    }
  }, [accessToken, userID]);

  const value = {
    user,
    RegisterUser,
    LoginUser,
    GetUser,
    accessToken,
    refreshToken,
    newSubrole,
    fetchNewSubrole,
    userID,
    role,
    userLoggedIN,
    setUserLoggedIN,
    loading,
    LogoutUser,
    loginError,
    userCreatedSuccessfully,
    responseSubrole,
    emailAlreadyCreated,
    setLoginError,
    API_BASE_URL,
    GenerateNewAccessToken,
    trainers,
    batches,
    admin,
    allTrainer,
    loginSuccess,
    setLoginSuccess,
    loadingBatches,
    error1,
    // Lazy fetch functions
    fetchTrainers,
    fetchAdmin,
    fetchBatches,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
