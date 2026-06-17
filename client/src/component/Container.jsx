import { Edit, Plus, Trash } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { fetchTodo, addTodo, deleteTodo, updateTodo } from '../services/route'
import toast from 'react-hot-toast'
import { asset } from '../assets/assets'

const Container = () => {
   
    const [todos, setTodos] = useState([])
   
    const [userData, setUserData] = useState({
        description: '',
        status: 'pending',
        date: new Date().toLocaleDateString()
    })

    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    const getAllTodos = async () => {
        try {
            const response = await fetchTodo()
            if (response.status >= 200 && response.status < 300) {
                setTodos(response.data) 
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load tasks")
        }
    }

    useEffect(() => {
        getAllTodos()
    }, [])

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
                 date: new Date().toLocaleDateString() 
            })

            getAllTodos()
        } catch (error) {
            console.error(error)
            toast.error("Operation failed")
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id)
            toast.success('Task Deleted')
            getAllTodos()
        } catch (error) {
            console.error(error)
            toast.error("Could not delete task")
        }
    }

    const handleEditClick = (item) => {
        setIsEditing(true)
        setEditId(item.id) 
        setUserData({
            description: item.description,
            status: item.status || 'pending',
            date: item.date
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

    return (
        <>
            <div className='w-200 h-200 overflow-hidden border-3 rounded-2xl border-slate-100 shadow-lg bg-slate-200 px-2 py-2'>
                {/* top section */}
                <div className='w-full h-20 border-3 flex flex-row gap-2 rounded-2xl border-slate-100 shadow-md items-center px-2 overflow-hidden py-2'>
                    <input
                        value={userData.description}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                description: e.target.value,
                            })
                        }
                        type='text'
                        placeholder="Enter your task..."
                        className='px-5 h-full w-full border outline-slate-300 shadow-md border-slate-50 rounded-2xl'
                    />
                    <span onClick={handleSaveTask} className='border-3 w-50 gap-2 group rounded-full h-10 flex items-center justify-center border-slate-100 bg-slate-300 shadow-md active:scale-105 select-none cursor-pointer'>
                        <Plus className={`transition-transform duration-200 ${isEditing ? 'rotate-45' : 'group-hover:rotate-180'}`} />
                        {isEditing ? 'Update task' : 'Add task'}
                    </span>
                </div>
               

                {/* lists */}
                <div className='w-full h-120 py-2 px-2 flex flex-col gap-2 mt-5 items-center overflow-y-scroll [&::-webkit-scrollbar]:hidden border-2 border-slate-100 shadow-lg'>
                    {todos.length > 0 ? (
                        todos.map((item, index) => (
                            <div key={item.id || index} className='w-full h-20 border rounded-2xl shadow-md border-slate-50 flex flex-row justify-between bg-white'>
                                <div className='h-full w-full flex px-3 flex-col justify-center py-2'>
                                    <span className='font-medium text-slate-700'>Task : {item.description}</span>
                                    <hr className='border border-gray-100 my-1' />
                                    <div className='flex gap-4 items-center'>
                                        <span className='text-xs text-slate-400'>Date : {item.date}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                                            item.status === 'Complete' ? 'bg-green-100 text-green-700' :
                                            item.status === 'InProgress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3 me-4 items-center'>
                                    <select 
                                        className='border rounded-full px-5 border-slate-200 shadow-md outline-none py-1 cursor-pointer bg-white'
                                        value={item.status || 'pending'}
                                        onChange={(e) => handleStatusChange(item, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="InProgress">InProgress</option>
                                        <option value="Complete">Complete</option>
                                    </select>
                                    <button 
                                        onClick={() => handleEditClick(item)} 
                                        className='cursor-pointer flex gap-2 flex-row items-center border h-10 px-5 rounded-full border-slate-100 bg-blue-100 text-blue-600 shadow-sm hover:bg-blue-200 active:scale-95 transition-transform'
                                    >
                                        <Edit size={15}/>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)} 
                                        className='cursor-pointer flex flex-row items-center gap-3 border h-10 px-5 rounded-full border-slate-100 bg-red-100 text-red-600 shadow-sm hover:bg-red-200 active:scale-95 transition-transform'
                                    >   
                                        <Trash size={15}/>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-slate-500 mt-10 flex flex-col items-center gap-4'>
                            No tasks found. Add a task to get started!
                            {asset?.empty && <img src={asset.empty} alt="" />}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Container
