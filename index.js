const formField = document.querySelector(".todo-form");
const inputField = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-btn");
const progressBar = document.querySelector(".progress-fill");
const clearButton = document.querySelector(".clear-completed");
const todoListContainer = document.querySelector(".todo-list");
const allFilterBtn = document.querySelector('[data-filter="all"]');
const activeFilterBtn = document.querySelector('[data-filter="active"]');
const completedFilterBtn = document.querySelector('[data-filter="completed"]');
const completedBtn = document.querySelector(".complete-btn");
const deleteBtn = document.querySelector(".delete-btn");
const tabs = document.querySelectorAll(".filter-btn");
const message = document.querySelector(".toast-message");

let filterBy = "all";

const storedItem = localStorage.getItem("stored-todo");

let todoList = storedItem ? JSON.parse(storedItem) : [];

const capitalizeWord = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getProgressBarPercentage = (completedTasks) => {
  if (todoList.length === 0) return 0;
  return (completedTasks.length / todoList.length) * 100;
};

const storeTodoInLocalStorage = (todoToStore) => {
  localStorage.setItem("stored-todo", JSON.stringify(todoToStore));
};

const filteredList = () => {
  const completedTask = todoList.filter((list) => list.status === "completed");
  const activeTask = todoList.filter((list) => list.status === "active");

  switch (filterBy) {
    case "active":
      return activeTask;
    case "completed":
      return completedTask;
    default:
      return todoList;
  }
};

const renderTodoListView = () => {
  const completedTask = todoList?.filter((list) => list.status === "completed");

  progressBar.style.width = `${getProgressBarPercentage(completedTask)}%`;

  todoListContainer.innerHTML = `
  ${filteredList()
    ?.map((todo) => {
      const isComplete = todo.status === "completed";

      return `
      <li class="task-item ${isComplete ? "done" : ""}">
      
        <div class="checkbox ${isComplete ? "checked" : ""}"
        onclick="updateTodoStatus('${todo.id}')">
        </div>

        <div class="priority-dot p-mid"></div>

        <span class="task-text">
        ${capitalizeWord(todo.title)}
        </span>

        <button class="delete-btn"
        onclick="deleteItem('${todo.id}')">
        x
        </button>

      </li>
      `;
    })
    .join("")}
  `;
};

const handleAddButtonClick = () => {
  const inputValue = inputField.value?.toLowerCase()?.trim();

  if (!inputValue) return;

  const alreadyExist = todoList.some((todo) => todo.title === inputValue);

  if (alreadyExist) {
    message.textContent = "Todo already exists";
    return;
  }

  message.textContent = "";

  todoList.push({
    id: Date.now().toString(),
    title: inputValue,
    status: "active",
  });

  inputField.value = "";
  renderTodoListView();
  storeTodoInLocalStorage(todoList);
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");
  });
});

const updateTodoStatus = (id) => {
  todoList = todoList.map((todo) => {
    const alreadyComplete = todo.status === "completed";
    const isActiveTodo = todo.id === id;
    if (isActiveTodo && alreadyComplete) {
      todo.status = "active";
    } else if (isActiveTodo) {
      todo.status = "completed";
    } else {
      return todo;
    }
    return todo;
  });

  renderTodoListView();
  storeTodoInLocalStorage(todoList);
};

const deleteItem = (id) => {
  todoList = todoList.filter((todo) => todo.id !== id);
  renderTodoListView();
  storeTodoInLocalStorage(todoList);
};

const clearTodo = () => {
  todoList = [];
  storeTodoInLocalStorage(todoList);
  renderTodoListView();
};

formField.addEventListener("submit", (e) => {
  e.preventDefault();
  handleAddButtonClick();
});

addButton.addEventListener("click", handleAddButtonClick);

allFilterBtn.addEventListener("click", () => {
  filterBy = "all";
  renderTodoListView();
});

activeFilterBtn.addEventListener("click", () => {
  filterBy = "active";
  renderTodoListView();
});

completedFilterBtn.addEventListener("click", () => {
  filterBy = "completed";
  renderTodoListView();
});

clearButton.addEventListener("click", () => clearTodo());

renderTodoListView();
