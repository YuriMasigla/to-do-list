const taskName = document.querySelector("#taskName");
const dateVal = document.querySelector("#date");
const timeVal = document.querySelector("#time");
const submit = document.querySelector("#submit");
const warning = document.querySelector("#warning");
const taskList = document.querySelector("#taskList");

let taskArray = JSON.parse(localStorage.getItem("taskList")) || [];
let taskIdCount = localStorage.getItem("taskIdCount") || 0;

const generateDeleteBtn = (taskId) => {
    return `<input type="button" value="Delete" class="delete" onclick="deleteTaskHandler('${taskId}')" />`
}

const updateTaskList = () => {
    if (taskArray != null) {
        const taskListItems = taskArray.map(task => (`
            <tr>
                <td>${task.name}</td>
                <td>${task.date}</td>
                <td>${task.time}</td>
                <td>${task.action}</td>
            </tr>
            `)
        ).join("");
        taskList.innerHTML = taskListItems;
    }
}

const deleteTaskHandler = taskId => {
    taskArray = taskArray.filter(task => {
        return task.id !== taskId;
    });
    localStorage.setItem("taskList", JSON.stringify(taskArray));
    updateTaskList();
};

const checkValidTime = () => {
    if (dateVal.value === new Date().toLocaleDateString("fr-ca")) {
        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false});
        timeVal.min = currentTime;
    }
    else {
        timeVal.removeAttribute("min");
    }
}

const addTaskHandler = () => {
    checkValidTime();
    if (taskName.value === "") {
        warning.innerHTML = "No task name specified!";
        return;
    }
    if (dateVal.value === "") {
        warning.innerHTML = "No date specified!";
        return;
    }
    if (timeVal.value < timeVal.min && timeVal.min) {
        warning.innerHTML = `Time must be greater than ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}`;
        return;
    }
    const taskObj = {
        name: taskName.value,
        date: dateVal.value,
        time: new Date(dateVal.value+"T"+timeVal.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        id: String(taskIdCount),
        action: generateDeleteBtn(taskIdCount)
    }
    taskIdCount++;
    localStorage.setItem("taskIdCount", taskIdCount);
    taskArray.push(taskObj);
    localStorage.setItem("taskList", JSON.stringify(taskArray));
    warning.innerHTML = null;
    updateTaskList();
}

updateTaskList();
dateVal.min = new Date().toLocaleDateString("fr-ca");
dateVal.addEventListener("change", checkValidTime)
submit.addEventListener("click", addTaskHandler);

