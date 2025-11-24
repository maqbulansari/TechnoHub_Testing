import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  const NetworkContext = createContext(null);
  
  export const NetworkProvider = ({ children }) => {
    const [isOnline, setOnline] = useState(navigator.onLine);

    const onlineCheck = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setOnline(response.status === 200);
      } catch (error) {
        setOnline(false);
      }
    };
  
    useEffect(() => {
      // Set up the interval to check network status every 5 seconds (5000 milliseconds)
      const interval = setInterval(() => {
        onlineCheck();
      }, 5000);
  
      // Initial check when the component mounts
      onlineCheck();
  
      // Clean up the interval when the component unmounts
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return (
      <NetworkContext.Provider value={{ isOnline }}>
        {children}
      </NetworkContext.Provider>
    );
  };
  
  export const useNetworkCheck = () => {
    const context = useContext(NetworkContext);
    if (!context) {
      throw Error("useNetworkCheck must be used inside NetworkProvider");
    }
    return context;
  };