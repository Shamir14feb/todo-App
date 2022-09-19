const myStore = window.localStorage;
const myListNames = 'myLists';
const toDoList = document.getElementById('toDoList');
const viewAllListDiv = document.getElementById('viewAllList');
const saveListButton = document.getElementById('saveListButton');
const editListName = document.querySelector('.heading i');
const addTaskButton = document.getElementById('addTaskButton');
const updateButton = document.getElementById('update');
const deleteButton = document.getElementById('delete');
const deleteList = document.getElementById('delete-list');

const todo = (function () {
    if (myStore.getItem(myListNames) === null) {
        myStore.setItem(myListNames, '[]');
    }

    function createList(listName) {
        const list = {
            listName: listName,
            tasks: []
        }

        const myLists = JSON.parse(myStore.getItem(myListNames))

        const listExists = myLists.some((eachItem) => {
            return eachItem.listName === listName;
        });

        if (listName === '') {
            alert("Please Enter a valid List");
        } else if (listExists) {
            alert("List Exists");
        } else {
            myLists.push(list)
            myStore.setItem(myListNames, JSON.stringify(myLists));
        }
    }

    function showTaskInSingleList() {
        const listName = document.querySelector('.heading h2');
        const myLists = JSON.parse(myStore.getItem(myListNames));

        const tasks = myLists.filter((eachItem) => {
            return listName.innerText.toLowerCase() === eachItem.listName;
        })[0].tasks.map((eachTask) => {
            const div = document.createElement('div');
            div.classList.add('eachTask');

            const task = document.createElement('li');
            task.classList.add('todo-item');

            const span = document.createElement('span');
            span.innerHTML = eachTask.taskName;

            const input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.classList.add('radio')

            const edit = document.createElement('i');
            edit.classList.add('fa-solid', 'fa-pen-to-square');

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-trash-can')

            if (eachTask.completed) {
                input.setAttribute('checked', '');
                task.style.backgroundColor = '#b5e48c';
            }

            input.addEventListener('click', (event) => {
                if (event.target.checked) {
                    event.target.parentElement.style.backgroundColor = '#b5e48c';
                } else {
                    event.target.parentElement.style.backgroundColor = '#ffe5d9';
                }
                const newList = myLists.map((each) => {
                    if (each.listName === listName.innerHTML.toLowerCase()) {
                        each.tasks.map((eachElement) => {
                            if (eachElement.taskName === event.target.previousElementSibling.innerText.toLowerCase()) {
                                eachElement.completed = !eachElement.completed;
                            }

                            return eachElement;
                        })
                    }

                    return each;
                });

                myStore.setItem(myListNames, JSON.stringify(newList));
                viewLists();
            });

            edit.addEventListener('click', (event) => {
                document.querySelector('.edit-todo').classList.toggle('open-edit');
                document.querySelector('.edit-todo h2 span').innerText = 'Task'
                document.querySelector('#previousUpdateName').innerText = document.querySelector('.list-sub-heading').innerText;
                document.querySelector('#currentTaskName').innerHTML = event.target.previousElementSibling.firstChild.innerText;
            });

            deleteIcon.addEventListener('click', (event) => {
                document.querySelector('.delete-todo').classList.toggle('open-edit');
                document.querySelector('#ListName').innerText = document.querySelector('.list-sub-heading').innerText;
                document.querySelector('#currentTask').innerHTML = event.target.previousElementSibling.previousElementSibling.firstChild.innerText;
            })

            task.append(span, input)
            div.append(task, edit, deleteIcon);

            return div;
        });
        document.querySelector('.todo-item-container').innerHTML = '';
        document.querySelector('.todo-item-container').append(...tasks);
        if (document.querySelectorAll('.todo-item-container li').length === 0){
            document.querySelector('.addTask #delete-list').style.display = '';
        } else {
            document.querySelector('.addTask #delete-list').style.display = 'none';
        }
    }

    function viewLists() {
        viewAllListDiv.innerHTML = '';
        const myLists = JSON.parse(myStore.getItem(myListNames));

        const allLists = myLists.map((eachItem) => {
            const newList = document.createElement('div');
            newList.classList.add('list');

            const listName = document.createElement('h4');
            listName.innerHTML = eachItem.listName;
            listName.classList.add('list-heading');

            const showTask = document.createElement('ul');
            showTask.classList.add('show-task');

            const tasks = eachItem.tasks.map((eachTask) => {
                const task = document.createElement('li');
                task.classList.add('task');
                task.innerHTML = eachTask.taskName;

                if (eachTask.completed) {
                    task.style.backgroundColor = '#b5e48c';
                }

                return task;
            });

            showTask.append(...tasks)
            newList.append(listName, showTask);

            newList.addEventListener('click', (event) => {
                document.querySelector('#singleList').style.display = 'block';
                document.querySelector('.heading h2').innerText = event.target.firstChild.innerText;
                showTaskInSingleList();
            });

            return newList;
        });

        viewAllListDiv.append(...allLists);
    }

    function createTask(listName, taskName) {
        const task = {
            taskName: taskName,
            completed: false
        }
        const myLists = JSON.parse(myStore.getItem(myListNames));

        const taskExists = myLists.filter((eachItem) => {
            return eachItem.listName === listName;
        })[0].tasks.some((eachItem) => {
            return eachItem.taskName === taskName;
        });

        if (taskName === '') {
            alert("task is empty");
        } else if (taskExists) {
            alert("Task Exists");
        } else {
            const newList = myLists.map((eachItem) => {
                if (eachItem.listName === listName) {
                    eachItem.tasks.push(task);
                }

                return eachItem;
            });

            myStore.setItem(myListNames, JSON.stringify(newList));
        }
    }

    function update(what, to, listName, taskName) {
        const myLists = JSON.parse(myStore.getItem(myListNames));

        if (what === 'list') {
            const listExists = myLists.some((eachList) => {
                return eachList.listName === to;
            });

            if (to === '') {
                alert("list is empty");
            } else if (listExists) {
                alert("list exists");
            } else {
                const newList = myLists.map((eachList) => {
                    if (eachList.listName === listName) {
                        eachList.listName = to
                    }
                    return eachList;
                })

                myStore.setItem(myListNames, JSON.stringify(newList));
                document.querySelector('.list-sub-heading').innerText = to;
            }
        } else if (what === 'task') {
            const taskExists = myLists.filter((eachList) => {
                return eachList.listName === listName;
            })[0].tasks.some((eachTask) => {
                return eachTask.taskName === to;
            });

            if (to === '') {
                alert('Task is Empty');
            } else if (taskExists) {
                alert("Task Exists");
            } else {
                const newList = myLists.map((each) => {
                    if (each.listName === listName) {
                        each.tasks.map((eachElement) => {
                            if (eachElement.taskName === taskName) {
                                eachElement.taskName = to;
                            }

                            return eachElement;
                        })
                    }

                    return each;
                });

                myStore.setItem(myListNames, JSON.stringify(newList));
            }
        }
    }

    viewLists();

    return {
        createNewList() {
            createList(toDoList.value.trim().toLowerCase());
            toDoList.value = '';
            viewLists();
        },
        updateTodo(event) {
            const name = document.querySelector('.edit-todo h2 span');
            if (name.innerText === 'List') {
                update(
                    'list',
                    event.target.previousElementSibling.value.trim().toLowerCase(),
                    document.querySelector('#previousUpdateName').innerText.toLowerCase()
                );
            } else if (name.innerText === 'Task') {
                update(
                    'task',
                    event.target.previousElementSibling.value.trim().toLowerCase(),
                    document.querySelector('#previousUpdateName').innerText.toLowerCase(),
                    document.querySelector('#currentTaskName').innerText.toLowerCase()
                );
                showTaskInSingleList();
            }
            document.querySelector('.edit-todo').classList.toggle('open-edit');
            event.target.previousElementSibling.value = '';
        },
        createNewTask(event) {
            createTask(document.querySelector('.list-sub-heading').innerText.toLowerCase(),
                event.target.previousElementSibling.value.trim().toLowerCase());

            event.target.previousElementSibling.value = '';
            showTaskInSingleList();
            viewLists();
        },
        delete(event) {
            const myLists = JSON.parse(myStore.getItem(myListNames));

            const newList = myLists.map((eachList) => {
                if (eachList.listName === document.querySelector('#ListName').innerText.toLowerCase()) {
                    const newTasks = eachList.tasks.filter((eachTask) => {
                        return eachTask.taskName !== document.querySelector('#currentTask').innerText.toLowerCase();
                    })

                    eachList.tasks = newTasks;
                }
                return eachList;
            })

            document.querySelector('.delete-todo').classList.toggle('open-edit');

            myStore.setItem(myListNames, JSON.stringify(newList));
            showTaskInSingleList();
        },
        deleteList(event) {
            const listName = document.querySelector('.list-sub-heading').innerText.toLowerCase();
            const myLists = JSON.parse(myStore.getItem(myListNames));

            const newList = myLists.filter((eachList) => {
                return eachList.listName !== listName;
            });

            myStore.setItem(myListNames, JSON.stringify(newList));
            document.querySelector('#singleList').style.display = 'none';
            viewLists();
        }
    }
})();

saveListButton.addEventListener('click', todo.createNewList);
addTaskButton.addEventListener('click', todo.createNewTask);
updateButton.addEventListener('click', todo.updateTodo);
deleteButton.addEventListener('click', todo.delete);
deleteList.addEventListener('click', todo.deleteList);
editListName.addEventListener('click', (event) => {
    document.querySelector('.edit-todo').classList.toggle('open-edit');
    document.querySelector('.edit-todo h2 span').innerText = 'List'
    document.querySelector('#previousUpdateName').innerText = event.target.previousElementSibling.innerText;
});