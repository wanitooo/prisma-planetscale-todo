"use client";

import React, { useEffect, useRef, useState } from "react";

// TODO: Design, User Login
const InputBox = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskFocused, setTaskFocused] = useState("");
  const [tasksDone, setTasksDone] = useState([]);
  const [taskEdits, setTaskEdits] = useState({
    currentTask: "",
    editedTaskValue: "",
  });
  useEffect(() => {
    getTasks();
  }, []);

  // Tasks can be added by clicking the + button or pressing enter
  const addTask = async (e) => {
    if (task === "") {
      return;
    }

    if (e === "click") {
      setTasks([...tasks, task]);
      postTask();
      setTask("");
    } else if (e.key === "Enter") {
      setTasks([...tasks, task]);
      postTask();
      setTask("");
    }
  };

  const editTask = (value, index) => {
    // console.log("index ", index);
    const newTasks = tasks.map((item, itemIndex) => {
      if (itemIndex === index) {
        // console.log("current task ", tasks[index], "edited task ", value);
        // await updateTask(tasks[index], value);
        setTaskEdits({
          currentTask: taskEdits.currentTask,
          editedTaskValue: value,
        });
        // console.log("task edits", taskEdits);
        return value;
      }
      return item;
    });

    setTasks(newTasks);
  };

  const taskDoneHandler = async (taskDone) => {
    let newTasks = [...tasksDone];
    if (newTasks.includes(taskDone)) {
      newTasks.splice(newTasks.indexOf(taskDone), 1);
      // console.log("new tasks", newTasks);
      postTaskDone(tasks[taskDone], false);
      // console.log("removed: ", taskDone);
      setTasksDone(newTasks);
    } else {
      postTaskDone(tasks[taskDone], true);
      // console.log("crossed: ", taskDone);
      setTasksDone([...tasksDone, taskDone]);
    }

    // console.log("tasks done, ", tasksDone);
    // tasksDone.forEach((item) => console.log(item));
    // console.log("````````");
  };

  // Rename to Task Interactions
  const taskOptions = async (e, value, index) => {
    let newTasks = [];
    if (e.key === "Enter") {
    }
    if (value === "") {
      if (e === "empty") {
        newTasks = tasks.filter((task) => {
          if (task !== tasks[index]) {
            // console.log("Empty task ", task);
            // Returns non empty tasks
            return task;
          }
          deleteTask(taskEdits.currentTask);
        });
        setTasks(newTasks);
      } else if (e.key === "Enter") {
        newTasks = tasks.filter((task) => {
          if (task !== tasks[index]) {
            return task;
          }
          deleteTask(taskEdits.currentTask);
          // console.log("task ", task, " tasksindex: ", index);
        });
        setTasks(newTasks);
      }
    }

    if (e === "delete") {
      newTasks = tasks.filter((task) => {
        if (task !== tasks[index]) {
          return task;
        }
        deleteTask(task);
      });
      setTasks(newTasks);
      // await getTasks();
    }

    return;
  };

  const getTasks = async (e) => {
    // e.preventDefault;

    const res = await fetch("/api/getTasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await res.json();
    setTasks(data);
    getTasksDone(data);
  };

  const getTasksDone = async (inputTasks) => {
    // e.preventDefault;

    const res = await fetch("/api/tasksDone", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await res.json();
    // Match tasks retrieved to current indexes
    // console.log("DATA.MAP ", data);
    let tasksDoneFromDb = data.map((item) => inputTasks.indexOf(item));
    setTasksDone(tasksDoneFromDb);
  };

  const postTaskDone = async (inputTask, status) => {
    // e.preventDefault;

    const res = await fetch("/api/tasksDone", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        task: inputTask,
        taskStatus: status,
      }),
    });
  };

  // console.log("tasks done", tasksDone);
  const postTask = async () => {
    const res = await fetch(`/api/postTasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        task,
        userEmail: "admin@email.com",
      }),
    });
    // console.log("res ", await res.json());

    const data = res.json();
    // console.log("Post Task, ", data);
    return data;
  };

  const deleteTask = async (task) => {
    const res = await fetch(`/api/delete/${task}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = res.json();
    // console.log("Delete Task, ", data);
    getTasks();
    return data;
  };

  const updateTask = async (currentTask, editedTask) => {
    const res = await fetch("/api/updateTask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentTask,
        editedTask,
      }),
    });
    const data = res.json();
    // console.log("Updated Task, ", data);
    // await getTasks();
  };

  return (
    <div className="flex flex-col h-screen gap-10 w-fit drop-shadow-xl">
      <div className="flex gap-2 justify-between ">
        <input
          type="text"
          className="border rounded-md px-2 w-full"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => addTask(e)}
        />
        <button
          className="bg-blue-600 rounded-md w-fit p-2 text-white"
          onClick={() => addTask("click")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-5 text-blue-500 justify-center items-center">
        {tasks.map((task, index) => (
          <div className="inline-flex gap-2 p-2" key={index}>
            <input
              type="text"
              className={`rounded-md px-2 hover:border-b-4 ${
                index === taskFocused
                  ? "  outline-none border-l-4 border-b-4"
                  : ""
              }  ${tasksDone.includes(index) ? "line-through" : ""}`}
              value={task}
              onChange={(e) => editTask(e.target.value, index)}
              onFocus={() => {
                setTaskFocused(index);
                setTaskEdits({ ...taskEdits, currentTask: task });
                // console.log("ON FOCUS", taskEdits);
              }}
              onBlur={async (e) => {
                setTaskFocused("");
                if (taskEdits.editedTaskValue !== "") {
                  await updateTask(
                    taskEdits.currentTask,
                    taskEdits.editedTaskValue
                  );
                }
                // console.log("ON BLUR", taskEdits);
                taskOptions("empty", task, index);
              }}
              onKeyDown={(e) => taskOptions(e, task, index)}
            />
            <button
              className="bg-green-600 rounded-md w-100 h-100 p-2 hover:bg-green-700 text-white"
              onClick={() => taskDoneHandler(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
            {/* Delete Button */}
            <button
              className="bg-red-600 rounded-md w-fit p-2  hover:bg-red-800 text-white"
              onClick={() => taskOptions("delete", task.task, index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputBox;
