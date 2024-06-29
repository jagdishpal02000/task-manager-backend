const {queryExecuter} = require('../utils/query-executer');

const createTask= async ({uid,title,description,due_date}) =>{
    const task = await queryExecuter(`INSERT INTO temp_tasks(title,description,uid,due_date,created_datetime,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,[title,description,uid,due_date,new Date(),'incompleted']);
    return task;
}

const getOneTask= async ({uid,taskId}) =>{
    try {
        const task = await queryExecuter(`SELECT * FROM temp_tasks WHERE id=$1 and uid=$2`,[taskId,uid]);
        return task;
    } catch (error) {
        return [];
    }
}

const getAllTasks = async ({uid,status,sort_type,sort_by}) => {
    try {
        let query = `SELECT * FROM temp_tasks WHERE uid=$1 `;
        let params = [uid];
        let paramIndex = 2;

        if (status) {
            query += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if(sort_by){
            if(!sort_type || (sort_type.toUpperCase() !== 'ASC' && sort_type.toUpperCase() !== 'DESC')){
                sort_type='DESC';
            }
            if(sort_by === 'created_datetime' || sort_by === 'due_date' ){
                query += ` ORDER BY ${sort_by} ${sort_type}`;
            }
        }
        const task = await queryExecuter(query, params);
        return task;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const deleteTask= async ({uid,taskId}) =>{
    try {
        const task = await queryExecuter(`DELETE FROM temp_tasks WHERE uid=$1 AND id=$2`,[uid,taskId]);
        return task;
    } catch (error) {
        return [];
    }
}

const updateTask= async ({uid,taskId,title,description,due_date,status}) =>{  
    const task = await queryExecuter(`UPDATE temp_tasks  
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_date = COALESCE($3, due_date),
        status = COALESCE($4, status)
      WHERE uid = $5 and id=$6`,[title,description,due_date,status,uid,taskId]);
        return task;
  
}


module.exports = {createTask,getOneTask,getAllTasks,deleteTask,updateTask};