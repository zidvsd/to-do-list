const addTaskBtn = document.getElementById("add-task");
const displayInput = document.getElementById("add-task-input");
const mainContainer = document.getElementById("main");
const popupValidation = document.getElementById("popup-validation");

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
  const del = () => {};
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

        // Create a new div element
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
        const dateText = document.createElement("p");
        dateText.textContent = currentDate();
        dateText.className = "font-bold w-full max-w-md text-left";
        // Set inner HTML for the new div
        newTaskDiv.innerHTML = `
        <input type="checkbox" class="checkbox" />
        <h1 class="text-black text-center">${capitalize(inputField.value)}</h1>
        <button class="btn btn-square btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" stroke="currentColor"
                class="bi bi-trash-fill hover:fill-current hover:stroke-current" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
        </button>
    `;
        // Append the new div to the parent container

        mainContainer.appendChild(newTaskDiv);
        mainContainer.appendChild(dateText);
      }

      // const taskCard = document.createElement("div");
      // taskCard.className = "";
    }
  });
});
