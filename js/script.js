const addTaskBtn = document.getElementById("add-task");
const displayInput = document.getElementById("add-task-input");
const mainContainer = document.getElementById("main");
const popupValidation = document.getElementById("popup-validation");
const deleteAllBtn = document.getElementById("delete-all");
const selectAllBtn = document.getElementById("select-all");
let checkedTasks = [];
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Date created
const currentDate = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
};

const loadTasks = () => {
  const storedData = localStorage.getItem("tasks");
  if (!storedData) return; // Stop execution if no data is found

  const storedTasks = JSON.parse(storedData);
  if (!Array.isArray(storedTasks)) return; // Ensure it's an array

  storedTasks.forEach((task) => {
    if (task && task.name && task.date) {
      createTaskElement(task.name, task.date);
    }
  });
};

const saveTask = (task) => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
};

const delTaskFromStorage = (taskName) => {
  try {
    let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Add null checks and ensure task and task.name exist before comparing
    storedTasks = storedTasks.filter((task) => {
      if (!task || !task.name) return true; // Skip invalid entries
      return task.name.toLowerCase() !== taskName.toLowerCase();
    });
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  } catch (error) {
    console.error("Error in delTaskFromStorage:", error);
    // Initialize storage if it's corrupted
    localStorage.setItem("tasks", JSON.stringify([]));
  }
};

const deleteAll = () => {
  deleteAllBtn.addEventListener("click", () => {
    // Attach ONCE outside createTaskElement
    checkedTasks.forEach(({ taskDiv, dateText }) => {
      if (taskDiv) {
        const taskName = taskDiv.querySelector("h1")?.textContent?.trim();
        if (taskName) {
          delTaskFromStorage(taskName);
        }
        taskDiv.remove();
      }
      if (dateText) {
        dateText.remove();
      }
    });

    checkedTasks = [];
  });
};

const selectAll = () => {
  selectAllBtn.addEventListener("change", (event) => {
    //Attach event listener only once
    const checkBox = document.querySelectorAll(".checkbox");
    checkedTasks = [];
    checkBox.forEach((checkbox) => {
      checkbox.checked = event.target.checked;

      if (checkbox.checked) {
        const taskDiv = checkbox.closest(".flex");
        const dateText = taskDiv ? taskDiv.nextElementSibling : null;

        checkedTasks.push({ taskDiv, dateText });
      }
    });
  });
};

const createTaskElement = (taskName, taskDate) => {
  // Create a new div element  (Moved to the TOP)
  const newTaskDiv = document.createElement("div");
  newTaskDiv.classList.add(
    "flex",
    "flex-row",
    "justify-between",
    "items-center",
    "mt-4",
    "p-4",
    "border",
    "border-black",
    "w-full",
    "h-auto",
    "text-black",
    "max-w-md"
  );

  // Set inner HTML for the new div (AFTER declaration)
  newTaskDiv.innerHTML = `
      <input id="select-task" type="checkbox" class="checkbox" />
      <h1 class="text-black text-center">${capitalize(taskName)}</h1>
      <button  class="btn btn-square btn-outline delete-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" stroke="currentColor"
              class="bi bi-trash-fill hover:fill-current hover:stroke-current" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
          </svg>
      </button>
  `;

  const dateText = document.createElement("p");
  dateText.textContent = taskDate;
  dateText.className = "date-text font-bold w-full max-w-md text-left";

  // Append the new div to the parent container
  mainContainer.appendChild(newTaskDiv);
  mainContainer.appendChild(dateText);

  const checkBox = newTaskDiv.querySelector(".checkbox"); // Now newTaskDiv is defined
  const deleteBtn = newTaskDiv.querySelector(".delete-btn"); // Now newTaskDiv is defined

  checkBox.addEventListener("change", (event) => {
    if (event.target.checked) {
      checkedTasks.push({ taskDiv: newTaskDiv, dateText });

      deleteBtn.addEventListener("click", () => {
        const taskName = newTaskDiv.querySelector("h1").textContent.trim();
        delTaskFromStorage(taskName);
        newTaskDiv.remove();
        dateText.remove();
        checkedTasks = checkedTasks.filter(
          (task) => task.taskDiv !== newTaskDiv
        );
      });
    } else {
      checkedTasks = checkedTasks.filter((task) => task.taskDiv !== newTaskDiv);
    }
  });
};
selectAllBtn.addEventListener("change", (event) => {
  if (event.target.checked) {
    selectAll();
    deleteAll();
  }
});

addTaskBtn.addEventListener("click", () => {
  const addTaskDiv = document.createElement("div");

  // Get body theme classes
  const bodyTheme = document.body.className; // Get the applied theme class

  // Apply the same theme class to the new div
  addTaskDiv.className = `p-4 rounded-md w-full max-w-xs ${bodyTheme}`;

  // Create an input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Type here";

  inputField.className =
    "task-input mt-4 input input-bordered rounded-md input-md w-full max-w-xs text-black placeholder:text-black";

  // Create a label
  const label = document.createElement("span");
  label.className = "label-text-alt";
  label.innerText = "Hit enter to add";

  // Append input and label to the div
  addTaskDiv.appendChild(inputField);
  addTaskDiv.appendChild(label);

  // Append the div to the container
  mainContainer.appendChild(addTaskDiv);

  const toHide = () => {
    popupValidation.classList.add("hidden");
  };

  const toDisplay = () => {
    popupValidation.classList.remove("hidden");
    document.body.addEventListener("click", () => {
      popupValidation.classList.add("hidden");
    });
  };

  inputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      if (inputField.value === "") {
        toDisplay();
      }
      if (/./.test(inputField.value)) {
        toHide();
        addTaskDiv.remove();
        // const taskCard = document.createElement("div");
        // taskCard.className = "";
        const task = {
          name: inputField.value,
          date: currentDate(),
        };
        saveTask(task);
        createTaskElement(task.name, task.date);
      }
    }
  });
});

window.onload = () => {
  loadTasks();
  deleteAll(); // Call deleteAll to attach the event listener
  selectAll();
};
