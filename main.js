const panel = document.querySelector("#panel");
const addBtn = document.querySelector("#add-btn");
const inputAdd = document.querySelector("#input-add");
const searchInput = document.querySelector("#search");
const todoItems = Array.from(document.querySelectorAll(".todo-item"));

const generateId = () => {
    return new Date().getTime();
};

const addEventForStatusChange = (todoItem) => {
    todoItem.addEventListener("click", (e) => {
        e.preventDefault();
        todoItem.classList.toggle("strike");
        const todo = todoItem.parentElement;
        const id = parseInt(todo.getAttribute("id"));
        statusChange(id);
    });
};

const addEventForDelete = (trashCan) => {
    trashCan.addEventListener("click", (e) => {
        e.preventDefault();
        const todo = trashCan.parentElement;
        const id = parseInt(todo.getAttribute("id"));
        removeTodoFromStorage(id);
        todo.remove();
    });
};

createTodo = (uid, name, isActive) => {
    const todo = document.createElement("a");
    todo.classList.add("panel-block", "todo-item");
    if (!isActive) {
        todo.classList.add("strike");
    }
    const textSpan = document.createElement("span");
    textSpan.classList.add("mr-auto");
    todo.append(textSpan);
    textSpan.textContent = name;
    todo.setAttribute("id", uid);

    addEventForStatusChange(textSpan);
    const textSpanIcon = document.createElement("span");
    textSpanIcon.classList.add("panel-icon", "has-text-danger");
    textSpanIcon.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    addEventForDelete(textSpanIcon);
    todo.append(textSpanIcon);

    return todo;
};

const todoInit = () => {
    panel.innerHTML = "";
    const currentList = JSON.parse(localStorage.getItem("todoList")) || [];
    currentList.forEach((todoitem) => {
        const todo = createTodo(todoitem.id, todoitem.name, todoitem.state);
        panel.append(todo);
    });
};

todoInit();

const addToLocalStorage = (todoItem) => {
    const currentList = JSON.parse(localStorage.getItem("todoList")) || [];
    currentList.push(todoItem);
    localStorage.setItem("todoList", JSON.stringify(currentList));
};

const removeTodoFromStorage = (id) => {
    let currentList = JSON.parse(localStorage.getItem("todoList")) || [];
    currentList = currentList.filter((item) => item.id !== id);
    localStorage.setItem("todoList", JSON.stringify(currentList));
};

const statusChange = (id) => {
    let currentList = JSON.parse(localStorage.getItem("todoList")) || [];
    currentList = currentList.map((item) => {
        if (item.id === id) {
            item.state = !item.state;
        }
        return item;
    });
    localStorage.setItem("todoList", JSON.stringify(currentList));
};

addBtn.addEventListener("click", () => {
    const inputVal = inputAdd.value;
    if (inputVal.length <= 2) {
        return;
    }
    const uid = generateId();
    const todo = createTodo(uid, inputVal, true);
    panel.append(todo);
    addToLocalStorage({ id: uid, name: inputVal, state: true });
    inputAdd.value = "";
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const keyword = searchInput.value;
        if (keyword && keyword.length > 2) {
            searchAndDisplayToDo(keyword);
        }
    } else {
        const keyword = searchInput.value;
        if (!keyword || keyword.length <= 1) {
            todoInit();
        }
    }
});

searchAndDisplayToDo = (keyword) => {
    panel.innerHTML = "";
    let currentList = JSON.parse(localStorage.getItem("todoList")) || [];
    currentList = currentList.filter((item) => {
        return item.name.toLowerCase().includes(keyword.toLowerCase());
    });

    const searchResult = document.createElement("p");
    searchResult.classList.add("notification", "is-light");
    searchResult.textContent = `${currentList.length} results found for the search query`;
    if (currentList.length) {
        searchResult.classList.add("is-primary");
    } else {
        searchResult.classList.add("is-danger");
    }
    panel.append(searchResult);
    currentList.forEach((todoitem) => {
        const todo = createTodo(todoitem.id, todoitem.name, todoitem.state);
        panel.append(todo);
    });
};
