const addTaskBtn = document.getElementById("add-task");
const displayInput = document.getElementById("add-task-input");
const mainContainer = document.getElementById("main");
const popupValidation = document.getElementById("popup-validation");
const deleteAllBtn = document.getElementById("delete-all");
const selectAllBtn = document.getElementById("select-all");
const bodyTheme = document.body.className; // Get the applied theme class
let tasks = [];
let checkedTasks = [];
const searchInput = document.getElementById("search-input");
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
    checkedTasks.forEach((task) => {
      // Iterate over task *data*
      delTaskFromStorage(task.name); // Use task.name
      task.div.remove(); // Remove the div from the DOM
      task.dateText.remove();
      tasks = tasks.filter((t) => t.name !== task.name); // Remove from tasks array as well
    });
    checkedTasks = [];

    selectAllBtn.checked = false;
  });
};
const selectAll = () => {
  selectAllBtn.addEventListener("change", (event) => {
    const checkBox = document.querySelectorAll(".checkbox");

    checkedTasks = []; // Reset checked tasks

    checkBox.forEach((checkbox) => {
      checkbox.checked = event.target.checked; // Check or uncheck all tasks

      // Find the corresponding task
      const taskDiv = checkbox.closest(".flex");
      const task = tasks.find((t) => t.div === taskDiv);

      if (event.target.checked && task) {
        checkedTasks.push(task); // Add to checkedTasks if selected
      }
    });

    updateCheckedCount(); // Ensure it updates after checking/unchecking
  });
};

const createTaskElement = (taskName, taskDate) => {
  // Create a new div element  (Moved to the TOP)
  const newTaskDiv = document.createElement("div");
  newTaskDiv.classList.add(
    "flex",
    "flex-row",
    "justify-between",
    "items-start",
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
      <h1 tabindex='0' class="text-black text-center">${capitalize(taskName)}</h1>
      <div class="flex flex-row gap-x-4">
        <button  class="edit-btn hover:opacity-50 transition duration-200">
          <img src='assets/icons/edit_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'
        </button>
        <button  class="btn btn-square btn-outline delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" stroke="currentColor"
                class="bi bi-trash-fill hover:fill-current hover:stroke-current" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
        </button>
    </div>      
  `;

  const dateText = document.createElement("p");
  dateText.textContent = taskDate;
  dateText.className = "date-text font-bold w-full max-w-md text-left";

  // Append the new div to the parent container
  mainContainer.appendChild(newTaskDiv);
  mainContainer.appendChild(dateText);

  const checkBox = newTaskDiv.querySelector(".checkbox");
  const deleteBtn = newTaskDiv.querySelector(".delete-btn");
  const editBtn = newTaskDiv.querySelector(".edit-btn");
  const h1 = newTaskDiv.querySelector("h1");

  const taskData = {
    name: taskName,
    date: taskDate,
    div: newTaskDiv,
    dateText: dateText,
    h1: h1,
  }; // Store task data
  editBtn.addEventListener("click", () => {
    h1.contentEditable = true;
    h1.focus();
    h1.classList.add("outline", "outline-black");
    h1.addEventListener("blur", () => {
      h1.contentEditable = false;
      h1.style.outline = "none";
      h1.innerText = capitalize(h1.innerText.trim());
    });
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(h1);
    range.collapse(false); // Move cursor to the end
    selection.removeAllRanges();
    selection.addRange(range);
    h1.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        h1.innerText = capitalize(h1.innerText.trim());
        event.preventDefault();

        h1.innerText === ""
          ? (toDisplay(), h1.focus()) // Runs both `toDisplay()` and `h1.focus()`
          : (toHide(), h1.blur()); // Runs both `toHide()` and `h1.blur()`
      }
    });
  });
  tasks.push(taskData); // Add task *data* to the tasks array

  checkBox.addEventListener("change", (event) => {
    if (event.target.checked) {
      checkedTasks.push(taskData); // Add task *data* to checkedTasks
    } else {
      checkedTasks = checkedTasks.filter((task) => task !== taskData); // Remove task *data*
    }
    updateCheckedCount();
  });
  deleteBtn.addEventListener("click", () => {
    // ✅ Check if the task is actually checked
    if (!checkBox.checked) return;

    // ✅ Remove from localStorage
    delTaskFromStorage(taskName);

    // ✅ Remove from UI
    newTaskDiv.remove();
    dateText.remove();

    // ✅ Remove from `tasks` array
    tasks = tasks.filter((task) => task.name !== taskName);

    // ✅ Remove from `checkedTasks`
    checkedTasks = checkedTasks.filter((task) => task.name !== taskName);
  });

  searchFunction();
};

addTaskBtn.addEventListener("click", () => {
  const addTaskDiv = document.createElement("div");

  // Get body theme classes

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
const toHide = () => {
  popupValidation.classList.add("hidden");
};

const toDisplay = () => {
  popupValidation.classList.remove("hidden");
  popupValidation.style.backgroundColor = `${bodyTheme}`;
  popupValidation.style.color = `${bodyTheme}`;
  document.body.addEventListener("click", () => {
    popupValidation.classList.add("hidden");
  });
};

window.onload = () => {
  loadTasks();
  deleteAll(); // Call deleteAll to attach the event listener
  selectAll();
  searchFunction();
  updateCheckedCount();
};

const searchFunction = () => {
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    tasks.forEach((task) => {
      const isMatch = task.name.toLowerCase().includes(searchValue);
      task.div.style.display = isMatch ? "flex" : "none";
      task.dateText.style.display = isMatch ? "block" : "none";
    });
  });
};

const updateCheckedCount = () => {
  const taskCount = tasks.length;
  const checkedTaskCount = checkedTasks.length;

  // Check only if ALL tasks are checked
  selectAllBtn.checked = taskCount > 0 && checkedTaskCount === taskCount;
};
