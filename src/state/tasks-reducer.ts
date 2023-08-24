import { TasksStateType } from "../App";
import { v1 } from "uuid";
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
  _SetTodolistsActionType,
 
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
  todolistsAPI,
} from "../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  todolistId: string;
  taskId: string;
};

export type AddTaskActionType = {
  type: "ADD-TASK";
  task: TaskType;
  todolistId: string
 
};

export type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS";
  todolistId: string;
  taskId: string;
  status: TaskStatuses;
};

export type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE";
  todolistId: string;
  taskId: string;
  title: string;
};
// export type SetTasksActionType = {
//   type: "SET-TASKS";
//   tasks: Array<TaskType>;
//   todolistId: string;
// };


type SetTasksTypeAction=ReturnType<typeof setTasksAC>


export type TasksActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  // | SetTasksActionType
  |SetTasksTypeAction
  | _SetTodolistsActionType
  

const initialState: TasksStateType = {
  /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/
};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: TasksActionsType
): TasksStateType => {
  switch (action.type) {
    case "SET-TODOLISTS": {

      const copyState = {...state}
      action.todolists.forEach((el)=>{
        copyState[el.id]=[]
      })
      return copyState
    }

    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      const tasks = stateCopy[action.todolistId];
      const newTasks = tasks.filter((t) => t.id !== action.taskId);
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }
    case "ADD-TASK": {

      return {

        ...state,
        [action.todolistId]:[action.task, ... state[action.todolistId]]
      }
    }
    
    //   const stateCopy = { ...state };
    //   const newTask : TaskType = {
    //     id: v1(),
    //     title: action.title,
    //     status: TaskStatuses.New,
    //     todoListId: action.todolistId, description: '',
    //     startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
    // }
    //   const tasks = stateCopy[newTask.todoListId];
    //   const newTasks = [newTask, ...tasks];
    //   stateCopy[newTask.todoListId] = newTasks;
    //   return stateCopy;
    // }
    case "CHANGE-TASK-STATUS": {
      let todolistTasks = state[action.todolistId];
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "CHANGE-TASK-TITLE": {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, title: action.title } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.todolistId]: [],
      };
    }
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }
    case "SET-TODOLISTS": {
      const stateCopy = { ...state };
      action.todolists.forEach((tl) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    }
    case "SET-TASKS": {
      // const stateCopy = { ...state };
      // stateCopy[action.todolistId] = action.tasks;
      // return stateCopy;
      return{...state,
        [action.todolistId]:action.tasks
    }
  }
    default:
      return state;
  }
};

export const removeTaskAC = (
  taskId: string,
  todolistId: string
): RemoveTaskActionType => {
  return { type: "REMOVE-TASK", taskId: taskId, todolistId: todolistId };
};
export const addTaskAC = (task: TaskType, todolistId:string): AddTaskActionType => {
  return { type: "ADD-TASK", task,todolistId};
};
// export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
//   return {type: 'ADD-TASK', title, todolistId}
// }
export const changeTaskStatusAC = (
  taskId: string,
  status: TaskStatuses,
  todolistId: string
): ChangeTaskStatusActionType => {
  return { type: "CHANGE-TASK-STATUS", status, todolistId, taskId };
};
export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todolistId: string
): ChangeTaskTitleActionType => {
  return { type: "CHANGE-TASK-TITLE", title, todolistId, taskId };
};


export const setTasksAC=( todolistId:string,tasks:TaskType[])=>({type:"SET-TASKS",tasks,todolistId} as const)
// export const setTasksAC = (
//   tasks: Array<TaskType>,
//   todolistId: string
// ): SetTasksActionType => {
//   return { type: "SET-TASKS", tasks, todolistId };
// };

// export const fetchTasksThunk = (dispatch: Dispatch) => {
//     todolistsAPI.getTasks(todolistId)
//         .then((res) => {
//             const tasks = res.data.items
//             dispatch(setTasksAC(tasks, todolistId))
//         })
//  }

// export const fetchTasksTC = (todolistId: string) => {
//   return (dispatch: Dispatch<TasksActionsType>) => {
//     todolistsAPI.getTasks(todolistId).then((res) => {
//       dispatch(setTasksAC(todolistId,res.data.items));
//     });
//   };
// };

export const fetchTasksTC = (todolistId: string) => 
{ return async (dispatch:Dispatch<TasksActionsType> ) => {
  try{
    const res= await todolistsAPI.getTasks(todolistId)
    dispatch(setTasksAC(todolistId,res.data.items));
  }
  catch{
    // Обработка ошибок, если необходимо
  }
}
    };
  

export const deleteTasksTC = (taskId: string, todolistId: string) => 
  (dispatch: Dispatch<TasksActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(() => {
      dispatch(removeTaskAC(taskId, todolistId));
    });
  };


export const addTaskTC = (todolistId: string, title: string) => {
  return (dispatch: Dispatch<TasksActionsType>) => {
    todolistsAPI.createTask(todolistId, title).then((res) => {
      const task=res.data.data.item;
      const action= addTaskAC(task,todolistId) 
      dispatch(action)
    });
  };
}
  export const changeTaskStatusTC = (todolistId:string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState:()=>AppRootStateType) => {
      let task= getState().tasks[todolistId].find((t)=>t.id===taskId)
      if(task){

        const model: UpdateTaskModelType = {
          title: task.title,
          description:task.description,
          deadline:task.deadline,
          priority:task.priority,
          startDate:task.startDate,
          status
        }
          todolistsAPI.updateTask(todolistId,taskId, model)
          .then(()=>{dispatch(changeTaskStatusAC(taskId, status,todolistId))})
        };
        }
    
  }

