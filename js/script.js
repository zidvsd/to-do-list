const addTaskBtn = document.getElementById("add-task");
const displayInput = document.getElementById("add-task-input");
const newTaskDivContainer = document.getElementById("new-task-container");
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
    "border-accent",
    "w-full",
    "h-auto",
    "max-w-md"
  );

  // Set inner HTML for the new div (AFTER declaration)
  newTaskDiv.innerHTML = `
      <input id="select-task" type="checkbox" class="checkbox checkbox-accent " />
      <h1 tabindex="0" class="font-inter font-regular break-words text-center text-base-400 flex-1 min-w-0 px-4 mx-4 select-none" >${capitalize(taskName)}</h1>
      <div class="flex flex-row gap-x-4 items-baseline">
        <button  class="edit-btn hover:opacity-50 w-full transition duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor" class="text-accent" stroke="currentColor"  stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
        </button>
        <button  class="btn btn-square  delete-btn bg-accent shadow-outline"  >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" stroke="currentColor"
                class="bi bi-trash-fill text-base-100 " viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
        </button>
    </div>      
  `;

  const dateText = document.createElement("p");
  dateText.textContent = taskDate;
  dateText.className =
    "font-poppins text-accent date-text font-bold w-full max-w-md text-left";

  // Append the new div to the parent container
  newTaskDivContainer.appendChild(newTaskDiv);
  newTaskDivContainer.appendChild(dateText);

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
  }; // store task data
  tasks.push(taskData); // add task data to the tasks array

  editBtn.addEventListener("click", () => {
    h1.contentEditable = true;
    h1.focus();
    h1.style.outline = "none";
    h1.classList.add("focus:ring-1", "focus:ring-base-content");
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(h1);
    range.collapse(false); // false means collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
    // When user clicks outside or presses Enter, save changes
    const saveEditedTask = () => {
      h1.contentEditable = false;

      h1.innerText = capitalize(h1.innerText.trim());

      // ✅ Get tasks from local storage, ensure it's an array
      let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

      // ✅ Ensure `storedTasks` is an array before using `.findIndex()`
      if (!Array.isArray(storedTasks)) {
        console.error("Local storage `tasks` is not an array. Resetting.");
        storedTasks = [];
      }

      // ✅ Find the index of the task
      let taskIndex = storedTasks.findIndex(
        (task) => task && task.name === taskName
      );

      if (taskIndex !== -1) {
        storedTasks[taskIndex].name = h1.innerText; // Update task name
        localStorage.setItem("tasks", JSON.stringify(storedTasks)); // Save back to localStorage
      } else {
        console.warn("Task not found in localStorage, skipping update.");
      }

      // ✅ Update task in `tasks` array
      taskData.name = h1.innerText;
    };

    h1.addEventListener("blur", saveEditedTask);

    h1.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const trimmedText = h1.innerText.trim();
        if (trimmedText === "") {
          toDisplay();
          h1.focus;
          return;
        }
        h1.innerText = capitalize(trimmedText);
        h1.style.textAlign = "center";
        toHide();
        h1.blur();
        saveEditedTask();
      }
    });
  });

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
  addTaskDiv.className = `p-4 rounded-md w-full max-w-xs ${bodyTheme}`;

  // Create an input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Type here";
  inputField.className =
    "task-input mt-4 input font-inter input-bordered rounded-md input-md w-full max-w-xs text-inherit placeholder:text-inherit";

  // Create a label
  const label = document.createElement("span");
  label.className = "label-text-alt";
  label.innerText = "Hit enter to add";

  // Append input and label to the div
  addTaskDiv.appendChild(inputField);
  addTaskDiv.appendChild(label);

  // Insert the div at the beginning of the container
  newTaskDivContainer.insertBefore(addTaskDiv, newTaskDivContainer.firstChild);

  // Focus the input field
  inputField.focus();

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

// theme changer
const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const select = document.getElementById("theme-select");
const savedTheme = localStorage.getItem("selectedTheme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  select.value = savedTheme; // Set the dropdown to the saved theme
}
themes.forEach((theme) => {
  const option = document.createElement("option");
  option.value = theme;
  option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1); // Capitalize first letter
  option.classList.add("text-accent");
  select.appendChild(option);
});

select.addEventListener("change", () => {
  const selectedTheme = select.value;
  document.documentElement.setAttribute("data-theme", selectedTheme);
  localStorage.setItem("selectedTheme", selectedTheme);
});
