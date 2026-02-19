import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { deleteToken } from "firebase/messaging";
import { messaging } from "@/firebase/firebase";
import { AUTH_BASE_URL, TECHNO_BASE_URL } from "@/environment";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userLoggedIN, setUserLoggedIN] = useState(false);
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const [role, setRole] = useState(null);
  const [responseSubrole, setResponseSubrole] = useState([]);
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

  // API Base URLs (from environment.jsx)
  // AUTH_BASE_URL for authentication endpoints: login, logout, register, etc.
  // TECHNO_BASE_URL for other endpoints: batches, learners, trainers, notifications, etc.
  // API_BASE_URL kept for backward compatibility
  const API_BASE_URL = TECHNO_BASE_URL;





  // Initialize auth state from localStorage    
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUserID = localStorage.getItem("userID");
    const storedRole = localStorage.getItem("role");
    // support both keys for backward compatibility
    const storedSubroleRaw =
      localStorage.getItem("subroles") || localStorage.getItem("subrole");

    // Parse stored subrole which may be JSON (array) or a plain string
    let parsedSubrole = [];
    if (storedSubroleRaw) {
      try {
        parsedSubrole = JSON.parse(storedSubroleRaw);
      } catch (e) {
        parsedSubrole = storedSubroleRaw.includes(",")
          ? storedSubroleRaw.split(",").map((s) => s.trim())
          : [storedSubroleRaw];
      }
    }

    if (storedAccessToken && storedRefreshToken && storedUserID && storedRole) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserID(storedUserID);
      // role stored as string for compatibility; if it's JSON, try to parse
      let parsedRole = storedRole;
      if (storedRole) {
        try {
          const maybe = JSON.parse(storedRole);
          // if array, pick first element for legacy single-role expectations
          parsedRole = Array.isArray(maybe) ? maybe[0] : maybe;
        } catch (e) {
          parsedRole = storedRole;
        }
      }
      setRole(parsedRole);
      setResponseSubrole(parsedSubrole);
      setUserLoggedIN(true);
    }
  }, []);

  // Set up Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (!config.headers.Authorization) {
          const token = localStorage.getItem("accessToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;


        if (originalRequest.url.includes("/login/refresh/")) {
          return Promise.reject(error);
        }

        if (
          error.response?.status === 401 &&
          error.response?.data?.code === "token_not_valid" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await GenerateNewAccessToken();
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
  }, []);



  // Lazy fetch functions - only called when explicitly needed
  // fetchTrainers() - Only fetches current user's trainer profile (single trainer name)
  // Should only be called when user is a TRAINER and on trainer-specific pages
  const fetchTrainers = async () => {
    if (trainers) return; // Already fetched (trainers is a string)
    // Only fetch if user is a trainer
    if (role !== "TRAINER" && !hasSubrole("TRAINER")) return;
    setLoading(true);
    try {
      const response = await axios.get(`${TECHNO_BASE_URL}/trainers/`, {
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
    if (role !== "ADMIN" && !hasSubrole("ADMIN")) return;
    setLoading(true);
    try {
      const response = await axios.get(`${TECHNO_BASE_URL}/Admin/`);
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
  //     const response = await axios.get(`${TECHNO_BASE_URL}/trainers/`);
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
      const response = await axios.get(`${TECHNO_BASE_URL}/batches/`);
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
        `${AUTH_BASE_URL}/register/`,
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
    const response = await axios.post(`${AUTH_BASE_URL}/login/`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    

    if (response.status === 200) {
      const { access, refresh, user_id } = response.data;

      // Support both `subroles` (plural) and `subrole` (singular) from API
      const subrolesRaw = response.data.subroles ?? response.data.subrole;
      const normalizedSubroles = Array.isArray(subrolesRaw)
        ? subrolesRaw
        : subrolesRaw
        ? [subrolesRaw]
        : [];

      // Role may come as array or string. Normalize for backwards compatibility.
      const roleRaw = response.data.role ?? response.data.roles;
      const normalizedRoles = Array.isArray(roleRaw) ? roleRaw : roleRaw ? [roleRaw] : [];
      const primaryRole = normalizedRoles.length > 0 ? normalizedRoles[0] : null;

      // Update context state
      setAccessToken(access);
      setRefreshToken(refresh);
      setUserID(user_id);
      setResponseSubrole(normalizedSubroles);
      setRole(primaryRole);
      setUserLoggedIN(true);

      // Save tokens and subroles/roles locally (store arrays as JSON and keep legacy keys)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userID", user_id);
      // store primary role for legacy code, and full roles array under `roles`
      if (primaryRole) localStorage.setItem("role", primaryRole);
      localStorage.setItem("roles", JSON.stringify(normalizedRoles));
      // store both plural and singular subrole keys for compatibility
      localStorage.setItem("subroles", JSON.stringify(normalizedSubroles));
      localStorage.setItem("subrole", normalizedSubroles.join(","));

      // Return info for navigation
      return { subrole: normalizedSubroles, role: normalizedRoles };
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

  // Helper to check whether the current user has a specific subrole
  const hasSubrole = (name) => {
    if (!name) return false;
    if (!responseSubrole) return false;
    return Array.isArray(responseSubrole)
      ? responseSubrole.includes(name)
      : responseSubrole === name;
  };

  useEffect(() => {
    console.log("AuthContext effect:", userLoggedIN);
  }, [userLoggedIN]);


  const GetUser = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/User/${userID}`);

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
      const response = await axios.get(`${AUTH_BASE_URL}/SubRole/`);

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
    const fcmToken = localStorage.getItem("fcm_token");
    const refreshToken = localStorage.getItem("refreshToken");

    try {

      if (fcmToken) {
        await axios.post("/unregister/", {
          token: fcmToken,
        });


        await deleteToken(messaging);
      }

      if (refreshToken) {
        await axios.post(`${AUTH_BASE_URL}/logout/`, {
          refresh_token: refreshToken,
        });
      }

    } catch (err) {
      console.error("Logout failed:", err);
    } finally {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      localStorage.removeItem("subrole");
      localStorage.removeItem("subroles");
      localStorage.removeItem("roles");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("fcm_token");
      window.location.href = "/";
    }
  };
  const refreshAxios = axios.create();

  const GenerateNewAccessToken = async () => {
    const refresh = localStorage.getItem("refreshToken");

    if (!refresh) {
      LogoutUser();
      throw new Error("No refresh token");
    }

    try {
      const response = await refreshAxios.post(
        `${AUTH_BASE_URL}/login/refresh/`,
        { refresh }
      );

      const newAccessToken = response.data.access;

      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      return newAccessToken;
    } catch (error) {
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
    hasSubrole,
    emailAlreadyCreated,
    setLoginError,
    API_BASE_URL,
    AUTH_BASE_URL,
    TECHNO_BASE_URL,
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
