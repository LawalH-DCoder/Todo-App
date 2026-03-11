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
const message = document.querySelector(".todo-message")

let filterBy = "all";

const storedItem = localStorage.getItem("stored-todo");

let todoList = storedItem ? JSON.parse(storedItem) : [];

const CapitalizeWord = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const StoreTodoInLocalStorage = (todoToStore) => {
  localStorage.setItem("stored-todo", JSON.stringify(todoToStore));
};

const FilteredList = () => {
  switch (filterBy) {
    case "active":
      return todoList.filter((list) => list.status === "active");
    case "completed":
      return todoList.filter((list) => list.status === "completed");
    default:
      return todoList;
  }
};

const RenderTodoListView = () => {
  todoListContainer.innerHTML = `
  ${FilteredList()
    ?.map((todo) => {
      const isComplete = todo.status === "completed";
      return `<li class="todo-item">
        <span class="todo-text">${CapitalizeWord(todo.title)}</span>
        <div class="todo-actions">
          <button class="complete-btn" onclick="UpdateTodoStatus('${todo.title}')">${isComplete ? "Mark as active again" : "Mark as completed"}</button>
          <button class="delete-btn" onclick="DeleteItem('${todo.title}')">x</button>
        </div>
      </li>`;
    })
    .join("")}
  `;
};

const HandleAddButtonClick = () => {
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
  RenderTodoListView();
  StoreTodoInLocalStorage(todoList);
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");
  });
});

const UpdateTodoStatus = (title) => {
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

  RenderTodoListView();
  StoreTodoInLocalStorage(todoList);
};

const DeleteItem = (title) => {
  todoList = todoList.filter((todo) => todo.title !== title);
  RenderTodoListView();
  StoreTodoInLocalStorage(todoList);
};

const ClearTodo = () => {
  filterBy = "all";
  todoList = [];
  localStorage.removeItem("stored-todo");
  RenderTodoListView();
};

addButton.addEventListener("click", HandleAddButtonClick);

allFilterBtn.addEventListener("click", () => {
  filterBy = "all";
  RenderTodoListView();
});

activeFilterBtn.addEventListener("click", () => {
  filterBy = "active";
  RenderTodoListView();
});

completedFilterBtn.addEventListener("click", () => {
  filterBy = "completed";
  RenderTodoListView();
});

clearButton.addEventListener("click", () => ClearTodo());

RenderTodoListView();
