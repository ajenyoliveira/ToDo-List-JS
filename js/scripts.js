// =========================
// Seleção de elementos
// =========================
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");

let oldInputValue = "";

// =========================
// Funções
// =========================

// Criar novo todo
const saveTodo = (text) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

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
};

// Alternar formulários
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// Atualizar todo
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    });
};

// Pesquisar todos
const searchTodos = (searchValue) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const title = todo.querySelector("h3").innerText.toLowerCase();

        todo.style.display = title.includes(searchValue.toLowerCase())
            ? "flex"
            : "none";
    });
};

// Filtrar todos
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        switch (filterValue) {
            case "all":
                todo.style.display = "flex";
                break;

            case "done":
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none");
                break;

            case "todo":
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none");
                break;
        }
    });
};

// =========================
// Eventos
// =========================

// Criar todo
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value.trim();

    if (inputValue) {
        saveTodo(inputValue);
    }
});

// Delegação de eventos
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest(".todo");

    if (!parentEl) return;

    const todoTitle = parentEl.querySelector("h3").innerText;

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

// Cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

// Salvar edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value.trim();

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// Pesquisar
searchInput.addEventListener("input", (e) => {
    searchTodos(e.target.value);
});

// Filtrar
filterSelect.addEventListener("change", (e) => {
    filterTodos(e.target.value);
});
