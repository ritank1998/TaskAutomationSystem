import express from "express"
import CircularJSON from "circular-json"
import Queue from "../queue.js"
import cron from "node-cron"
import { userDetails, taskDetails, dumpedTask } from "../../database/models/schemas.js"


export const addUsers = async (req, res) => {
    try {
        const { name, id } = req.body
        const myUser = userDetails({
            Name: name,
            User_Id: id
        })
        const newUser = myUser.save()
        res.status(200).json(CircularJSON.stringify({ newUser }))
    }
    catch (error) {
        res.statu(500).json(CircularJSON.stringify({ error: error.message }))
    }
}

export const addTask = async (req, res) => {
    try {
        const { taskName, taskId } = req.body
        const newTask = taskDetails({
            taskName,
            taskId
        })
        const nextTask = newTask.save()
        res.status(200).json(CircularJSON.stringify({ nextTask }))
    }
    catch (error) {
        res.status(500).json(CircularJSON.stringify({ error: error.message }))
    }
}

export const getUsers = async (req, res) => {
    try {
        const myUsers = await userDetails.find({})
        res.status(200).json(CircularJSON.stringify({ myUsers }))
    }
    catch (error) {
        res.status(500).json(CircularJSON.stringify({ error: error.message }))
    }
}

export const getTask = async () => {
    let poppedTask = [];
    let reqTask = ''
    let reqTaskId
    const q = new Queue();
    let duplicateFound = []
    try {
        // Api se sab ek baar me nikalo
        const allTasks = await taskDetails.find({});
        const dumpedTasks = await dumpedTask.find({});

        // map banao or map me check kro name and Id
        const taskIdMap = new Map(allTasks.map(task => [task.taskName, task.taskId]));
        //yha par keeda kia hai
        for (const [taskName, taskId] of taskIdMap.entries()) {
            reqTask = taskName
            reqTaskId = taskId
        }
        //yha tak keeda kia hai
        const dumpedTaskMap = new Map(dumpedTasks.map(task => [task.taskName, task.taskId]));

        // Find duplicates (leetcode pr use kia hua logic finally works here)
        const potentialDuplicates = [];
        for (const [name, dumpedTaskId] of dumpedTaskMap.entries()) {
            const existingTaskId = taskIdMap.get(name);
            if (existingTaskId && existingTaskId !== dumpedTaskId) {
                potentialDuplicates.push({
                    taskName: name,
                    existingTaskId,
                    dumpedTaskId,
                });
            }
        }

        // Log potential duplicates or no duplicate
        if (potentialDuplicates.length) {
            console.log("Potential duplicates found:");
            potentialDuplicates.forEach(duplicate => {
                console.log(
                    `\t- Task Name: ${duplicate.taskName}` +
                    `\t- Existing Task ID: ${duplicate.existingTaskId}` +
                    `\t- Dumped Task ID: ${duplicate.dumpedTaskId}`
                );
                duplicateFound.push(duplicate.taskName, duplicate.existingTaskId)
            });
            console.log("duplicateFound is:- ", duplicateFound)
        } else {
            const queueTask = [...taskIdMap]
            for (let i = 0; i < queueTask.length; i++) {
                let nTask = queueTask[i];
                q.push(nTask);
            }

            if (q.isEmpty()) {
                console.log("No Task Remaining !!!");
            } else {
                //yha se bhi
                const item = q.pop();
                poppedTask.push(item);
                const requiredTask = await taskDetails.findOne({ taskName: item });
                console.log(requiredTask);

                const taskDone = dumpedTask({
                    taskName: reqTask,
                    taskId: reqTaskId,
                });

                await taskDone.save();
                await taskDetails.deleteOne({ taskName: item });
            }
        }

        const queueTask = [...duplicateFound]
        for (let i = 0; i < queueTask.length; i++) {
            let nTask = queueTask[i];
            q.push(nTask);
        }

        if (q.isEmpty()) {
            console.log("No Task Remaining !!!");
        } else {
            //yha se bhi
            const item = q.pop();
            poppedTask.push(item);
            const requiredTask = await taskDetails.findOne({ taskName: item });
            console.log(requiredTask);

            const taskDone = dumpedTask({
                taskName: item,
                taskId: requiredTask.taskId,
                statusId: requiredTask.statusId, // Include statusId in dumpedTask
            });

            await taskDone.save();
            await taskDetails.deleteOne({ taskName: item });
        }
    }
    catch (error) {
        console.log(error)
    }
    //yha par end queue o print kro for showoff
    console.log(poppedTask);
    q.display();
}



cron.schedule('*/10 * * * * *', () => {
    console.log('Running cron job...');
    getTask()
});

