const taskModel = require('../model/task.js');

exports.getAllTasks = asyncWrapper(async (req, res) => {
    const {status,sort_by,sort_type} = req.query;
    const allTasks = await taskModel.getAllTasks({uid:req.uid,status,sort_by,sort_type});
    if(allTasks && allTasks.length >0){
        return res.status(200).json({
           tasks : allTasks
        });
    }else{
        return res.status(400).json({
            message : 'there are not tasks'
         });
    }
});

exports.createTask = asyncWrapper(async (req, res) => {
    let {
        title,
        description,
        due_date,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!title) {
        flag = false;
        message = "title cannot be empty";
    }

    if (!description) {
        flag = false;
        message = "description cannot be empty";
    }

    if (flag) {
        const [createdTask] = await taskModel.createTask({uid:req.uid,title,description,due_date});
            message="Task Created Successfully";
            return res.status(200).json({
                message: message,
                task_id : createdTask.id,
                task : createdTask,
            });
    } else {
        res.status(status).json({
            message: message,
        });
    }

});

exports.getOneTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;
    const taskDetails = await taskModel.getOneTask({uid:req.uid,taskId});
    if(taskDetails && taskDetails.length >0){
        return res.status(200).json({
           task : taskDetails[0]
        });
    }else{
        return res.status(400).json({
            message : 'task not found'
         });
    }
});

exports.updateTask = asyncWrapper(async (req, res) => {

    const {taskId} = req.params;
      let {
        title,
        description,
        due_date,
        status,
    } = req.body;

    let flag = true;
    if(status && (status.toLowerCase() !== 'incompleted' && status.toLowerCase() !== 'completed')){
        flag=false;
        message='invalid status type';
    }

    if(flag){
        const update = await taskModel.updateTask({uid:req.uid,title,description,due_date,status,taskId});
        message="Task Updated Successfully";
        return res.status(200).json({
            message: message,
        });
    }else{
        res.status(400).json({
            message: message,
        });
    }

});

exports.deleteTask = asyncWrapper(async (req, res) => {

    const {taskId} = req.params;
    const taskDetails = await taskModel.deleteTask({uid:req.uid,taskId});
    if(taskDetails){
        return res.status(200).json({
           message:"task deleted successfully"
        });
    }else{
        return res.status(400).json({
            message : 'task not found'
         });
    }

});
