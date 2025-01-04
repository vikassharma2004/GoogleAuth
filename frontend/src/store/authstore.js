import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";





axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://google-auth-1zkl.vercel.app";



export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
  

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/register`, { email, password, name });
           toast.success("Account created successfully");
            
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false })
            toast.success("Email verified successfully");
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false});
			throw error;
		}
	},
    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/forgot-password`, { email });
            toast.success("Password reset email sent successfully");
			set({ message: response.data.message, isLoading: false }) 
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
                redirect:false
			});
			throw error;
		}
	},
    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`/api/auth/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false, user: null });
		}
	},
    resetPassword: async (token, password) => {
		console.log(token, password);
		
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
            toast.success("Password reset successfully");
			set({ message: response.data.message, isLoading: false});
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
               
			});
			throw error;
		}
	},
    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`/api/auth/logout`);
            toast.success("Logged out successfully");
			set({ user: null, isAuthenticated: false, error: null, isLoading: false});
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
    login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/login`, { email, password });
            toast.success("Logged in successfully");
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
             
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			
		}
	},
}))