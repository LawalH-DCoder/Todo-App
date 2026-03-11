const formField = document.querySelector(".todo-form");
const inputField = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-btn");
const clearButton = document.querySelector(".clear-completed");
const todoListContainer = document.querySelector(".todo-list");
const allFilterBtn = document.querySelector('[data-filter="all"]');
const activeFilterBtn = document.querySelector('[data-filter="active"]');
const completedFilterBtn = document.querySelector('[data-filter="completed"]');
const completedBtn = document.querySelector(".complete-btn");
const deleteBtn = document.querySelector(".delete-btn");
const tabs = document.querySelectorAll(".filter-btn");
const message = document.querySelector(".todo-message");

let filterBy = "all";

const storedItem = localStorage.getItem("stored-todo");

let todoList = storedItem ? JSON.parse(storedItem) : [];

const capitalizeWord = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const storeTodoInLocalStorage = (todoToStore) => {
  localStorage.setItem("stored-todo", JSON.stringify(todoToStore));
};

const filteredList = () => {
  switch (filterBy) {
    case "active":
      return todoList.filter((list) => list.status === "active");
    case "completed":
      return todoList.filter((list) => list.status === "completed");
    default:
      return todoList;
  }
};

const renderTodoListView = () => {
  todoListContainer.innerHTML = `
  ${filteredList()
    ?.map((todo) => {
      const isComplete = todo.status === "completed";
      return `<li class="todo-item">
        <span class="todo-text">${capitalizeWord(todo.title)}</span>
        <div class="todo-actions">
          <button class="complete-btn" onclick="updateTodoStatus('${todo.title}')">${isComplete ? "Mark as active again" : "Mark as completed"}</button>
          <button class="delete-btn" onclick="deleteItem('${todo.title}')">x</button>
        </div>
      </li>`;
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

const updateTodoStatus = (title) => {
  todoList = todoList.map((todo) => {
    const alreadyComplete = todo.status === "completed";
    const isActiveTodo = todo.title === title;
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

const deleteItem = (title) => {
  todoList = todoList.filter((todo) => todo.title !== title);
  renderTodoListView();
  storeTodoInLocalStorage(todoList);
};

const clearTodo = () => {
  filterBy = "all";
  todoList = [];
  localStorage.removeItem("stored-todo");
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
