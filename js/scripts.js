
// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");

let oldId = "";


//Local Storage// 

const getTodosFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
};

const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

//Funções// 
const isDuplicate = (text) => {
    const todos = getTodosFromLocalStorage();
    return todos.some((t) => t.text.toLowerCase() === text.toLowerCase());
};

const saveTodo = (text, done = false, save = true, id = Date.now().toString()) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("data-id", id);

    if (done) {
        todo.classList.add("done");
    }

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

    if (save) {
        const todos = getTodosFromLocalStorage();
        todos.push({ id, text, done });
        saveTodosToLocalStorage(todos);
    }
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const savedTodos = getTodosFromLocalStorage();
    const index = savedTodos.findIndex((t) => t.id === oldId);

    if (index !== -1) {
        savedTodos[index].text = text;
        saveTodosToLocalStorage(savedTodos);
    }

    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        if (todo.getAttribute("data-id") === oldId) {
            todo.querySelector("h3").innerText = text;
        }
    });
};

const searchTodos = (searchValue) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        const title = todo.querySelector("h3").innerText.toLowerCase();
        todo.style.display = title.includes(searchValue.toLowerCase()) ? "flex" : "none";
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        switch (filterValue) {
            case "all":
                todo.style.display = "flex";
                break;
            case "done":
                todo.style.display = todo.classList.contains("done") ? "flex" : "none";
                break;
            case "todo":
                todo.style.display = !todo.classList.contains("done") ? "flex" : "none";
                break;
        }
    });
};

// Eventos

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value.trim();

    if (inputValue) {
        if (isDuplicate(inputValue)) {
            alert("Essa tarefa já existe!");
            return;
        }
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest(".todo");

    if (!parentEl) return;

    const todoId = parentEl.getAttribute("data-id");

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        const savedTodos = getTodosFromLocalStorage();
        const index = savedTodos.findIndex((t) => t.id === todoId);
        if (index !== -1) {
            savedTodos[index].done = parentEl.classList.contains("done");
            saveTodosToLocalStorage(savedTodos);
        }
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        const savedTodos = getTodosFromLocalStorage();
        saveTodosToLocalStorage(savedTodos.filter((t) => t.id !== todoId));
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = parentEl.querySelector("h3").innerText;
        oldId = todoId;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value.trim();
    if (editInputValue) {
        updateTodo(editInputValue);
    }
    toggleForms();
});

searchInput.addEventListener("input", (e) => {
    searchTodos(e.target.value);
});

filterSelect.addEventListener("change", (e) => {
    filterTodos(e.target.value);
});

// Carregar tarefas ao abrir a página
const loadTodos = () => {
    const todos = getTodosFromLocalStorage();
    todos.forEach((todo) => saveTodo(todo.text, todo.done, false, todo.id));
};

loadTodos();