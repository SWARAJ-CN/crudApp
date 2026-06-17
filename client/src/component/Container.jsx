import { Edit, Plus, Trash, Check, LogOut, AlertTriangle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { fetchTodo, addTodo, deleteTodo, updateTodo } from '../services/route'
import toast from 'react-hot-toast'
import { asset } from '../assets/assets'

const Container = ({ onLogout }) => {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState(null)
    
    const loggedInUser = JSON.parse(localStorage.getItem('user')) || null
    const currentUserId = loggedInUser?.id || null

    const [userData, setUserData] = useState({
        description: '',
        status: 'pending',
        date: new Date().toLocaleDateString(),
        userId: currentUserId
    })

    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        if (currentUserId) {
            setUserData(prev => ({ ...prev, userId: currentUserId }))
        }
    }, [currentUserId])

    const getAllTodos = async () => {
        setIsLoading(true)
        try {
            const response = await fetchTodo()
            if (response.status >= 200 && response.status < 300) {
                const userSpecificTodos = response.data.filter(
                    (todo) => todo.userId === currentUserId
                )
                setTodos(userSpecificTodos) 
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load tasks")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (currentUserId) {
            getAllTodos()
        }
    }, [currentUserId])

    const handleSaveTask = async () => {
        if (!userData.description.trim()) {
            toast.error("Task description cannot be empty")
            return
        }

        try {
            if (isEditing) {
                await updateTodo(editId, userData)
                toast.success('Task Updated')
                setIsEditing(false)
                setEditId(null)
            } else {
                await addTodo(userData)
                toast.success('Task Added')
            }
            
            setUserData({
                 description: '',
                 status: 'pending',
                 date: new Date().toLocaleDateString(),
                 userId: currentUserId
            })

            getAllTodos()
        } catch (error) {
            console.error(error)
            toast.error("Operation failed")
        }
    }

    const confirmDeleteClick = (id) => {
        setTaskToDelete(id)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return
        try {
            await deleteTodo(taskToDelete)
            toast.success('Task Deleted')
            getAllTodos()
        } catch (error) {
            console.error(error)
            toast.error("Could not delete task")
        } finally {
            setShowDeleteModal(false)
            setTaskToDelete(null)
        }
    }

    const handleEditClick = (item) => {
        setIsEditing(true)
        setEditId(item.id) 
        setUserData({
            description: item.description,
            status: item.status || 'pending',
            date: item.date,
            userId: item.userId
        })
    }

    const handleStatusChange = async (item, newStatus) => {
        try {
            const updatedItem = { ...item, status: newStatus }
            await updateTodo(item.id, updatedItem)
            toast.success('Status Updated')
            getAllTodos()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update status")
        }
    }

    const handleLogoutClick = () => {
        localStorage.removeItem('user')
        if (onLogout) onLogout()
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-5 sm:p-8 bg-[#e0e8f6] rounded-[32px] border border-white/60 shadow-[8px_8px_20px_rgba(163,177,198,0.5),_-8px_-8px_20px_rgba(255,255,255,0.8)] relative">
            
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-slate-700 tracking-tight drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)]">Workspace</h2>
                    {loggedInUser?.username && (
                        <span className="text-xs text-slate-500 font-medium tracking-wide">Logged in as: {loggedInUser.username}</span>
                    )}
                </div>
                <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-white/80 bg-[#e0e8f6] text-slate-600 shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.9)] hover:shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] active:scale-95 transition-all duration-150 cursor-pointer"
                >
                    <LogOut size={14} className="text-slate-500" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#e0e8f6] rounded-2xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),_inset_-4px_-4px_8px_rgba(255,255,255,0.8)] items-center mb-6">
                <input
                    value={userData.description}
                    onChange={(e) =>
                        setUserData({
                            ...userData,
                            description: e.target.value,
                        })
                    }
                    type="text"
                    placeholder="Enter your task..."
                    className="w-full px-4 py-3 text-slate-700 bg-[#e9f0fa] rounded-xl outline-none shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3)] border border-white/40 focus:shadow-[inset_2px_2px_5px_rgba(59,130,246,0.2)] transition-all text-sm font-medium placeholder-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
                />
                <button 
                    onClick={handleSaveTask} 
                    className={`w-full sm:w-auto px-6 py-3 gap-2 group rounded-xl flex items-center justify-center font-bold text-sm transition-all active:scale-98 select-none cursor-pointer whitespace-nowrap border ${
                        isEditing 
                            ? 'bg-amber-500 border-amber-400 text-white shadow-[4px_4px_10px_rgba(245,158,11,0.4),_-4px_-4px_10px_rgba(255,255,255,0.5)] hover:bg-amber-600' 
                            : 'bg-slate-800 border-slate-700 text-white shadow-[4px_4px_10px_rgba(30,41,59,0.3),_-4px_-4px_10px_rgba(255,255,255,0.5)] hover:bg-slate-900'
                    }`}
                >
                    {isEditing ? <Check size={16} /> : <Plus size={16} className={`transition-transform duration-200 ${isEditing ? 'rotate-45' : 'group-hover:rotate-90'}`} />}
                    {isEditing ? 'Update task' : 'Add task'}
                </button>
            </div>
           
            <div className="min-h-[300px] max-h-[550px] overflow-y-auto pr-1 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-300">
                {isLoading ? (
                    [1, 2, 3].map((n) => (
                        <div key={n} className="w-full rounded-2xl p-5 bg-[#e0e8f6] border border-white/40 shadow-[4px_4px_10px_rgba(163,177,198,0.4),_-4px_-4px_10px_rgba(255,255,255,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-slate-300/60 rounded-md w-3/4"></div>
                                <div className="flex gap-2 items-center">
                                    <div className="h-3 bg-slate-300/60 rounded-md w-16"></div>
                                    <div className="h-5 bg-slate-300/60 rounded-full w-20"></div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 justify-end pt-3 md:pt-0">
                                <div className="h-9 bg-slate-300/60 rounded-xl w-24"></div>
                                <div className="h-9 bg-slate-300/60 rounded-xl w-16"></div>
                                <div className="h-9 bg-slate-300/60 rounded-xl w-20"></div>
                            </div>
                        </div>
                    ))
                ) : todos.length > 0 ? (
                    todos.map((item, index) => (
                        <div 
                            key={item.id || index} 
                            className="w-full border border-white/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#e0e8f6] shadow-[5px_5px_12px_rgba(163,177,198,0.4),_-5px_-5px_12px_rgba(255,255,255,0.85)] hover:shadow-[2px_2px_5px_rgba(163,177,198,0.3),_-2px_-2px_5px_rgba(255,255,255,0.7)] transition-all duration-200 gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-700 break-words text-sm sm:text-base drop-shadow-[0.5px_0.5px_0px_rgba(255,255,255,0.7)]">
                                    {item.description}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center mt-2.5">
                                    <span className="text-xs text-slate-500 font-bold bg-white/30 px-2 py-0.5 rounded-md shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">{item.date}</span>
                                    <span className={`text-[10px] px-3 py-0.5 rounded-full font-extrabold tracking-wider uppercase border shadow-[1px_1px_2px_rgba(0,0,0,0.05)] ${
                                        item.status === 'Complete' ? 'bg-emerald-500 text-white border-emerald-400' :
                                        item.status === 'InProgress' ? 'bg-amber-500 text-white border-amber-400' : 
                                        'bg-slate-600 text-white border-slate-500'
                                    }`}>
                                        {item.status || 'pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 border-t border-slate-300/40 pt-4 md:pt-0 md:border-0 justify-end">
                                <select 
                                    className="text-xs font-bold border border-white/80 rounded-xl px-3 py-2.5 outline-none shadow-[3px_3px_6px_rgba(163,177,198,0.4),_-3px_-3px_6px_rgba(255,255,255,0.8)] cursor-pointer bg-[#e0e8f6] text-slate-600 focus:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4)] transition-all"
                                    value={item.status || 'pending'}
                                    onChange={(e) => handleStatusChange(item, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                </select>
                                
                                <button 
                                    onClick={() => handleEditClick(item)} 
                                    className="cursor-pointer flex gap-1.5 items-center text-xs font-bold border border-white/80 py-2.5 px-3.5 rounded-xl bg-[#e0e8f6] text-blue-600 shadow-[3px_3px_6px_rgba(163,177,198,0.4),_-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4)] active:scale-95 transition-all"
                                >
                                    <Edit size={13} className="text-blue-500" />
                                    <span>Edit</span>
                                </button>
                                
                                <button 
                                    onClick={() => confirmDeleteClick(item.id)} 
                                    className="cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-white/80 py-2.5 px-3.5 rounded-xl bg-[#e0e8f6] text-rose-600 shadow-[3px_3px_6px_rgba(163,177,198,0.4),_-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4)] active:scale-95 transition-all"
                                >   
                                    <Trash size={13} className="text-rose-500" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center gap-4 rounded-2xl border border-dashed border-slate-400/40 bg-[#e0e8f6] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.2)]">
                        {asset?.empty ? (
                            <img src={asset.empty} alt="Empty state" className="w-24 h-24 object-contain opacity-40 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]" />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-[#e0e8f6] border border-white flex items-center justify-center text-slate-400 font-black text-xl shadow-[3px_3px_6px_rgba(163,177,198,0.4),_-3px_-3px_6px_rgba(255,255,255,0.8)]">!</div>
                        )}
                        <div>
                            <p className="text-sm font-bold text-slate-600 drop-shadow-[0.5px_0.5px_0px_rgba(255,255,255,0.8)]">No tasks found</p>
                            <p className="text-xs text-slate-500 max-w-xs mt-1 px-4">Your task list is completely clear. Add something above to construct your day.</p>
                        </div>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-600/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
                    <div className="w-full max-w-sm bg-[#e0e8f6] rounded-[24px] p-6 border border-white/70 shadow-[10px_10px_25px_rgba(163,177,198,0.5),_-10px_-10px_25px_rgba(255,255,255,0.8)] text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-[#e0e8f6] border border-white flex items-center justify-center text-rose-500 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] mb-4">
                            <AlertTriangle size={22} />
                        </div>
                        <h3 className="text-lg font-black text-slate-700 tracking-tight drop-shadow-[0.5px_0.5px_0px_rgba(255,255,255,0.8)]">Delete Task?</h3>
                        <p className="text-xs text-slate-500 font-medium mt-2 px-2">Are you sure you want to remove this item? This action cannot be reversed.</p>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setTaskToDelete(null)
                                }}
                                className="flex-1 py-2.5 rounded-xl border border-white/80 bg-[#e0e8f6] text-slate-600 font-bold text-xs shadow-[3px_3px_6px_rgba(163,177,198,0.4),_-3px_-3px_6px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4)] cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 py-2.5 rounded-xl border border-rose-600 bg-rose-500 text-white font-bold text-xs shadow-[3px_3px_8px_rgba(239,68,68,0.3),_-3px_-3px_8px_rgba(255,255,255,0.6)] hover:bg-rose-600 active:scale-95 cursor-pointer transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Container