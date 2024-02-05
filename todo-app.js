/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
// Анонимная самовызывающаяся функция, создающая простое приложение для управления списком дел
(() => {
  // Функция создания заголовка приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Функция создания формы для добавления нового дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // Добавление классов для стилизации элементов Bootstrap
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    // Устанавливаем атрибут disabled для кнопки при загрузке
    button.disabled = true;

    // Обработчик события для проверки содержимого поля ввода
    input.addEventListener('input', () => {
      button.disabled = input.value.trim() === '';
    });

    // Добавление элементов в форму
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // Возвращение объекта с элементами формы
    return {
      form,
      input,
      button,
    };
  }

  // Функция создания списка дел
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // Функция создания элемента списка дел
  function createTodoItem(data, id) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let itemId = id;
    // Добавление классов для стилизации элементов Bootstrap
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = data.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';

    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // Если дело помечено выполненным, добавляем соответствующий класс
    if (data.done) {
      item.classList.add('list-group-item-success');
    }

    // Добавление элементов в группу кнопок и в элемент списка
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Возвращение объекта с элементами списка дел
    return {
      itemId,
      item,
      doneButton,
      deleteButton,
    };
  }
  // Функция создания ID, путем увеличивания уже существующего наибольшего значения
  function createId(todoArr) {
    let maxId = [];
    if (todoArr.length > 0) {
      for (let i = 0; i < todoArr.length; i++) {
        maxId.push(todoArr[i].id);
      }
      return Math.max(...maxId);
    }
    return 0;
  }

  // Функция поиска индекса элемента в массиве по ID
  function findId(todoArr, index) {
    let foundIndex = null;
    for (let i = 0; i < todoArr.length; i++) {
      if (todoArr[i].id === index) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }

  // Функция сохраняет данные в LocalStorage
  function setToLocalStorage(key, todoArr) {
    localStorage.setItem(key, JSON.stringify(todoArr));
  }

  // Функция получает данные из LocalStorage
  function getToLocalStorage(key) {
    let localDate = localStorage.getItem(key);
    return localDate ? JSON.parse(localDate) : [];
  }

  // Функция создания всего приложения для управления списком дел
  function createTodoApp(container, title = 'Список дел', listName) {
    // Создание заголовка, формы и списка дел
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let todoArr = getToLocalStorage(listName);

    // Добавление элементов в контейнер
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // Проверка наличия данных в LocalStorage, при наличии отрисовка их на экране
    if (todoArr.length > 0) {
      for (let i = 0; i < todoArr.length; i++) {
        let todoItem = createTodoItem({ name: todoArr[i].name, done: todoArr[i].done }, todoArr[i].id);

        // Обработчик события нажатия кнопки "Готово"
        todoItem.doneButton.addEventListener('click', () => {
          todoItem.item.classList.toggle('list-group-item-success');
          let itemToChange = findId(todoArr, todoItem.itemId);
          todoArr[itemToChange].done = !todoArr[itemToChange].done;
          setToLocalStorage(listName, todoArr);
        });

        // Обработчик события нажатия кнопки "Удалить"
        todoItem.deleteButton.addEventListener('click', () => {
          // Запрос подтверждения перед удалением
          if (confirm('Вы уверены?')) {
            todoItem.item.remove();
            let itemToRemove = findId(todoArr, todoItem.itemId);
            todoArr.splice(itemToRemove, 1);
            setToLocalStorage(listName, todoArr);
          }
        });

        todoList.append(todoItem.item);
      }
    }

    // Обработчик события отправки формы
    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Проверка, что поле ввода не пустое
      if (!todoItemForm.input.value) {
        return;
      }

      // Создание ID для элемента списка дел
      let todoId = createId(todoArr) + 1;

      // Создание элемента списка дел
      let todoItem = createTodoItem({
        name: todoItemForm.input.value,
        done: false,
      }, todoId);

      // // Создание элемента списка дел для архива
      let todoItemArr = {
        id: todoId,
        name: todoItemForm.input.value,
        done: false,
      };

      // Добавление элемента списка дел в архив
      todoArr.push(todoItemArr);
      setToLocalStorage(listName, todoArr);

      // Обработчик события нажатия кнопки "Готово"
      todoItem.doneButton.addEventListener('click', () => {
        todoItem.item.classList.toggle('list-group-item-success');
        let itemToChange = findId(todoArr, todoItem.itemId);
        todoArr[itemToChange].done = !todoArr[itemToChange].done;
        setToLocalStorage(listName, todoArr);
      });

      // Обработчик события нажатия кнопки "Удалить"
      todoItem.deleteButton.addEventListener('click', () => {
        // Запрос подтверждения перед удалением
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          let itemToRemove = findId(todoArr, todoItem.itemId);
          todoArr.splice(itemToRemove, 1);
          setToLocalStorage(listName, todoArr);
        }
      });

      // Добавление элемента (li) в список дел (ul) на экране
      todoList.append(todoItem.item);

      // Очистка поля ввода
      todoItemForm.input.value = '';
    });
  }

  // Добавление функции создания приложения в глобальный объект window
  window.createTodoApp = createTodoApp;
})();
