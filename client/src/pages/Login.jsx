import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, User } from 'lucide-react'
import { loginUser, registerUser } from '../services/route'
import toast from 'react-hot-toast'

const Login = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rememberMe: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const toggleMode = () => {
        setIsRegister(!isRegister)
        setFormData({
            username: '',
            email: '',
            password: '',
            rememberMe: false
        })
        setShowPassword(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (isRegister && !formData.username.trim()) {
            toast.error('Username is required')
            return
        }
        if (!formData.email.trim() || !formData.password.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)
        try {
            if (isRegister) {
                const reqBody = {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
                
                const response = await registerUser(reqBody)
                
                if (response && response.status >= 200 && response.status < 300) {
                    toast.success('Registration successful! Please sign in.')
                    setIsRegister(false)
                    setFormData({
                        username: '',
                        email: reqBody.email,
                        password: '',
                        rememberMe: false
                    })
                } else {
                    toast.error(response?.data?.message || response?.data || 'Registration failed')
                }
            } else {
                const reqBody = {
                    email: formData.email.trim(),
                    password: formData.password
                }
                
                const response = await loginUser(reqBody)
                
                if (response && response.status >= 200 && response.status < 300) {
                    toast.success('Welcome back!')
                    if (onLoginSuccess) onLoginSuccess()
                } else {
                    toast.error('Invalid email or password')
                }
            }
        } catch (error) {
            console.error("Authentication Failure: ", error)
            
            if (error.response) {
                const serverMessage = error.response.data?.message || error.response.data
                
                if (error.response.status === 404) {
                    toast.error("Endpoint not found (404). Check backend route matching configs.")
                } else if (error.response.status === 401) {
                    toast.error("Invalid credentials.")
                } else {
                    toast.error(typeof serverMessage === 'string' ? serverMessage : "Server error encountered")
                }
            } else if (error.request) {
                toast.error("No response from server. Is your backend running?")
            } else {
                toast.error("An unexpected application error occurred")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-slate-100 rounded-3xl border border-slate-200/40 shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]">
            <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight transition-all duration-200">
                    {isRegister ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="text-sm text-slate-500 transition-all duration-200">
                    {isRegister ? 'Sign up to get started with your organizer' : 'Enter your credentials to access your account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {isRegister && (
                    <div className="space-y-1.5 transition-all duration-300">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
                            Username
                        </label>
                        <div className="relative flex items-center">
                            <User className="absolute left-4 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="JohnDoe"
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3.5 text-slate-700 bg-slate-100 rounded-xl border border-transparent outline-none focus:border-slate-300 transition-all text-sm disabled:opacity-60 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
                        Email Address
                    </label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-4 text-slate-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            disabled={isLoading}
                            className="w-full pl-11 pr-4 py-3.5 text-slate-700 bg-slate-100 rounded-xl border border-transparent outline-none focus:border-slate-300 transition-all text-sm disabled:opacity-60 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center pl-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Password
                        </label>
                        {!isRegister && (
                            <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Forgot password?
                            </a>
                        )}
                    </div>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-slate-400" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="w-full pl-11 pr-12 py-3.5 text-slate-700 bg-slate-100 rounded-xl border border-transparent outline-none focus:border-slate-300 transition-all text-sm disabled:opacity-60 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]"
                        />
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {!isRegister && (
                    <div className="flex items-center justify-between pt-1 pl-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 bg-slate-100 border border-transparent rounded-md transition-all shadow-[2px_2px_4px_#cbd5e1,-2px_-2px_4px_#ffffff] peer-checked:shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] peer-checked:bg-blue-500/10 flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:bg-blue-600 after:rounded-sm after:scale-0 peer-checked:after:scale-100 after:transition-transform"></div>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">Remember me</span>
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 gap-2 bg-slate-100 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center transition-all select-none cursor-pointer shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] disabled:opacity-70 disabled:cursor-not-allowed group mt-4 border border-slate-200/20"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <>
                            <span>{isRegister ? 'Sign up' : 'Sign in'}</span>
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={isLoading}
                        className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer bg-transparent border-0 outline-none transition-colors"
                    >
                        {isRegister ? 'Sign in' : 'Sign up free'}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login