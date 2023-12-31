"use client"
import UserContext from '@/context/userContext'
import { ThreeCircles } from 'react-loader-spinner'
import { deleteTask, getUserTask } from '@/services/taskService'
import React, { useContext, useEffect, useState } from "react"
import Task from './Task'
import { toast } from 'react-toastify'

function ShowTaskPage() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(UserContext)
    async function loadTasks(userId) {
        try {
            setLoading(true)
            const tasks = await getUserTask(userId)
            setTasks([...tasks].reverse())
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (context.user) {
            loadTasks(context.user._id)
        }
    }, [context.user]);
    async function deleteTaskParent(taskId) {
        try {
            const dData = await deleteTask(taskId)
            const newTasks = tasks.filter(item => item._id != taskId)
            setTasks(newTasks);
            toast.success("Task is remove ", {
                position: 'top-center'
            })
            // console.log(dData);
        } catch (error) {
            console.log(error);
            toast.error("error to delete task")
        }
    }
    return (
        <div className='grid grid-cols-12 my-3'>
            <div className='col-span-6 col-start-4'>
                <h1 className='text-3xl my-5 '>Your Tasks ({tasks.length})</h1>
                {loading ?
                    <div className='flex justify-center items-center'><ThreeCircles height={40} color='blue' />
                    </div>
                    :
                    tasks.map((task) => (
                        <Task task={task} key={task._id} deleteTaskParent={deleteTaskParent} />
                    ))
                }
            </div>
        </div>
    )
}

export default ShowTaskPage