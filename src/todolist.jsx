import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const taskInputRef = useRef();

  /* Функция addTask создается с использованием хука useCallback. Он используется для добавления
  новой задачи в массив состояний «задачи». */
  const addTask = useCallback(() => {
    /* `const newTask = TaskInputRef.current.value;` извлекает текущее значение поля ввода, на которое
    ссылается `taskInputRef`. Он используется для получения значения, введенного пользователем в
    поле ввода, и присвоения его переменной newTask. */
    const newTask = taskInputRef.current.value;
    /* Строка `const Task = { Task: newTask, Completed: false, startTime: new Date() };` создает новый
    объект задачи. Он имеет три свойства: */
    const task = { task: newTask, completed: false, startTime: new Date() };
    /* `setTasks((prevTasks) => [...prevTasks, Task]);` обновляет переменную состояния `tasks`,
    добавляя новую задачу к существующему массиву задач. */
    setTasks((prevTasks) => [...prevTasks, task]);
    /* `taskInputRef.current.value = '';` устанавливает значение поля ввода, на которое ссылается
    `taskInputRef`, в пустую строку. Это делается после добавления задачи в список, чтобы очистить
    поле ввода и подготовить его для ввода следующей задачи. */
    taskInputRef.current.value = '';
  }, []);

  /* Функция toggleTaskCompletion использ для переключения статуса завершения задачи в массиве Tasks. */
  const toggleTaskCompletion = useCallback((index) => {
    /* `setTasks((prevTasks) => ...)` обновляет переменную состояния `tasks`, предоставляя новое
    значение на основе предыдущего значения `tasks`. Параметр prevTasks представляет предыдущее
    значение Tasks. Используя этот синтаксис, мы гарантируем, что работаем с самым актуальным
    значением «задач» при его обновлении. */
    setTasks((prevTasks) =>
      /* `prevTasks.map((task, i) =>` выполняет итерацию по каждой задаче в массиве `prevTasks` и
      возвращает новый массив с теми же задачами, за исключением задачи с индексом `i`. Если индекс
      текущей задачи совпадает по предоставленному индексу, он создает новый объект задачи с
      включенным свойством `completed`. В противном случае он возвращает задачу как есть. */
      prevTasks.map((task, i) =>
        /* Выражение `i === index ? { ...task, Completed: !task.completed } : Task` — условный
        (тройной) оператор. Он проверяет, равен ли текущий индекс «i» предоставленному «индексу».
        Если это так, он создает новый объект, распространяя свойства текущего объекта Task и
        устанавливает для свойства Completed значение, противоположное текущему значению
        Task.completed. Это эффективно переключает статус завершения задачи. Если индекс не
        совпадает, он просто возвращает текущий объект «задача» как есть. */
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

 /* Функция deleteTask используется для удаления задачи из массива задач. */
  const deleteTask = useCallback((index) => {
    /* Удаляем задачу из массива `tasks`. */
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    /* Строка `const storeTasks = localStorage.getItem('tasks');` извлекает значение, хранящееся в
    локальном хранилище браузера под ключом "задачи". Он присваивает полученное значение переменной
    storeTasks. */
    const storedTasks = localStorage.getItem('tasks');
/* Код `if (storedTasks) { setTasks(JSON.parse(storedTasks));` проверяет, есть ли какие-либо задачи,
хранящиеся в локальном хранилище браузера. Если есть сохраненные задачи, он извлекает их с помощью
localStorage.getItem('tasks')`, а затем анализирует строку JSON в массив задач с помощью
JSON.parse()`. Наконец, он устанавливает полученные задачи в качестве начального значения состояния
Tasks с помощью setTasks(). */
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

/* Хук используется для сохранения массива задач в локальном хранилище браузера при каждом его изменении */
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    /* Функция updateTaskDurations отвечает за обновление продолжительности каждой задачи в массиве
    Tasks. Он рассчитывает продолжительность путем вычитания времени начала каждой задачи из
    текущего времени. Если задача выполнена, ее продолжительность остается неизменной. Затем
    возвращается обновленный массив задач. */
    const updateTaskDurations = () => {
      /* `setTasks((prevTasks) => ...)` обновляет переменную состояния `tasks`, предоставляя новое
      значение на основе предыдущего значения `tasks`. Параметр prevTasks представляет предыдущее
      значение Tasks. Используя этот синтаксис, мы гарантируем, что работаем с самым актуальным
      значением «задач» при его обновлении. */
      setTasks((prevTasks) => {
        /* Строка `const updateTasks = prevTasks.map((task) => {` создает новый массив с именем
        `updatedTasks` путем перебора каждой задачи в массиве `prevTasks`. Она применяет функцию к
        каждой задаче и возвращает новую задачу. объект с обновленными свойствами. */
        const updatedTasks = prevTasks.map((task) => {
          if (!task.completed) {
            /* Строка `const period = new Date() - Task.startTime;` вычисляет продолжительность задачи
            путем вычитания времени начала задачи из текущего времени. Он использует функцию «new
            Date()» для получения текущего времени и вычитает время начала задачи, чтобы получить
            продолжительность в миллисекундах */
            const duration = new Date() - task.startTime;
            return {
              ...task,
              duration
            };
          }
          return task;
        });
        return updatedTasks;
      });
    };

/* Код `const интервал = setInterval(updateTaskDurations, 1000);` устанавливает повторяющийся интервал,
который вызывает функцию `updateTaskDurations` каждые 1000 миллисекунд (1 секунду). Эта функция
отвечает за обновление продолжительности каждой задачи в массиве Tasks. */
    const interval = setInterval(updateTaskDurations, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

/* Хук отвечает за обновление обозначений и стилей задач в массиве Tasks. */
  useEffect(() => {
    const updateTaskNotations = () => {
      setTasks((prevTasks) => {
        /* Строка `const TasksWithNotation = prevTasks.map((task) => ({` создает новый массив с именем
        `tasksWithNotation` путем итерации по каждой задаче в массиве `prevTasks`. Для каждой задачи
        создается новый объект с те же свойства, что и у задачи, но с дополнительным свойством
        «нотация», для которого установлено значение «не определено». */
        const tasksWithNotation = prevTasks.map((task) => ({
          ...task,
          notation: undefined
        }));

        /* Код `const CompletedTasks = TasksWithNotation.filter((task) => Task.completed);` фильтрует
        массив `tasksWithNotation` и создает новый массив с именем `completedTasks`, который
        содержит только задачи со свойством `completed`, установленным в `true `. */
        const completedTasks = tasksWithNotation.filter(
          (task) => task.completed
        );

        /* Код проверяет, есть ли выполненные задачи в массиве CompletedTasks. Если есть завершенные
        задачи, он вычисляет минимальную продолжительность среди этих завершенных задач, используя
        функцию Math.min() и оператор расширения (...) для передачи длительности каждой завершенной
        задачи в качестве аргументов функции ` Функция Math.min()`. Минимальная продолжительность
        затем сохраняется в переменной minDuration. */
        if (completedTasks.length > 0) {
          const minDuration = Math.min(
            ...completedTasks.map((task) => task.duration)
          );
          /* Код `const maxDuration = Math.max(...completedTasks.map((task) => Task.duration));` находит
          максимальную длительность среди завершенных задач. */
          const maxDuration = Math.max(
            ...completedTasks.map((task) => task.duration)
          );

          /* Код перебирает каждую задачу в массиве «completedTasks» и проверяет, равна ли
          продолжительность задачи минимальной длительности («minDuration»). Если да, то для
          свойств «notation» и «style» делает соответствующие установки */
          completedTasks.forEach((task) => {
            if (task.duration === minDuration) {
              task.notation = 'RECORD';
              task.style = '#3a997d';
            }
            if (task.duration === maxDuration) {
              task.notation = 'WORST';
              task.style = '#c0684b';
            }
            if (task.duration !== minDuration && task.duration !== maxDuration) {
              task.notation = '';
              task.style = '#4b4b4b';
            }
          });
        }

        /* Строка return jobsWithNotation; возвращает обновленный массив задач с добавленным свойством
        notation. Этот обновленный массив будет установлен в качестве нового значения переменной
        состояния Tasks. */
        return tasksWithNotation;
      });
    };

    const interval = setInterval(updateTaskNotations, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * Функция formatDuration принимает продолжительность в миллисекундах и возвращает отформатированную
   * строку, представляющую продолжительность в днях, часах, минутах и секундах.
   * Функция formatDuration возвращает строку в формате «дни:часы:минуты:секунды».
   */
  const formatDuration = (duration) => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return `${days}:${hours}:${minutes}:${seconds}`;
  };

  /* useMemo используется для запоминания списка задач, что означает, что список задач будет пересчитываться только в том случае, если зависимости («tasks», «toggleTaskCompletion» и «deleteTask») изменятся. */
  const taskList = useMemo(() => {
    /* Код `return Tasks.map((task, index) => (` отображает массив `tasks` и возвращает новый массив
    элементов. Для каждой `task` в массиве `tasks` он создает новый элемент с указанной структурой
    JSX. Параметр index представляет индекс текущей задачи в массиве. */
    return tasks.map((task, index) => (
      /* Назначается уникальный ключ каждому отображаемому компоненту с помощью индексной переменной. Свойство style используется для установки цвета компонента. */
      <div className='task' key={index} style={{ color: task.style }}>
        {/* Ставим заглавную букву каждому таску. */}
        <span>{task.task.replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase())}</span>
        {/* Если параметр «task.completed» имеет значение true, он отображает кнопку с текстом
        «Завершено» и присоединяет обработчик событий «onClick», который вызывает функцию
        «toggleTaskCompletion» с параметром «index». Если `task.completed` имеет значение false, он
        отображает кнопку с именем класса "false" и текстом "False" и присоединяет тот же обработчик
    событий `onClick`. */}
        {task.completed ? (
          <button onClick={() => toggleTaskCompletion(index)}>completed</button>
        ) : (
          <button className='false' onClick={() => toggleTaskCompletion(index)}>false</button>
        )}
        {/* Проверяем существует ли длительность задачи и если да, то вызывает функцию formatDuration
        для форматирования продолжительности и отображения ее внутри элемента span. Если
        длительность задачи не существует, отображается пустая строка. */}
        <span className='duration'>{task.duration ? formatDuration(task.duration) : ''}</span>
        {task.notation && <span className='notation' style={{ color: task.style }}>{task.notation}</span>}
        <button onClick={() => deleteTask(index)}>delete</button>
      </div>
    ));
  }, [tasks, toggleTaskCompletion, deleteTask]);
          
            return (
              <div className='container'>
                <h1 className='title'>TODO</h1>
                <div className='input'>
                  <input className='text' type="text" ref={taskInputRef} style={{fontSize: "27px"}} onKeyDown={(e) => e.key === 'Enter' && addTask()}/>
                  <button className='add' onClick={addTask}>ADD TASK</button>
                </div>
                <div className='list'>{taskList}</div>
              </div>
            );
          };
          
          export default TodoList;