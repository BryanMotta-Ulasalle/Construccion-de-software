import React, { useEffect, useState, useContext } from "react";
import { Search } from "lucide-react";
import { createTask, updateTask, deleteTask, getTaskDoneCount, getTaskPendingCount, getTasks } from "../services/tasks.services";
import Title from "../components/my_ui/Title";
import AddTask from "../components/my_ui/AddTask";
import TableTasks from "../components/my_ui/TableTasks";
import EditTask from "../components/my_ui/EditTask";
import StatsCard from "../components/my_ui/StatsCard";
import {UserContext} from "../context/UserContext"


const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputValueName, setInputValueName] = useState("");

  const [inputValueAsignUser, setInputValueAsignUser] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estados para edición
  const [editInputValue, setEditInputValue] = useState("");
  const [editInputValueName, setEditInputValueName] = useState("");
  const [editInputValueStatus, setEditInputValueStatus] = useState("");
  const [editIsLoading, setEditIsLoading] = useState(false);
  const [editIsDialogOpen, setEditIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalTasksDone, setTotalTasksDone] = useState(0);
  const [totalTasksPending, setTotalTasksPending] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  

  const { users } = useContext(UserContext);


  useEffect(() => {
    async function loadData() {
      try {
        const res = await getTasks(currentPage, pageSize, searchQuery);
        setTasks(res.data.data);
        setTotalTasks(res.data.total);
        setTotalPages(res.data.pages);
        
        // Cargar estadísticas
        await tasksStats();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    loadData();
  }, [currentPage, pageSize, refreshTrigger, searchQuery]);

   async function tasksStats() { 
    try {
      const doneRes = await getTaskDoneCount();
      const pendingRes = await getTaskPendingCount();
      setTotalTasksDone(doneRes.data.count);
      setTotalTasksPending(pendingRes.data.count);
      console.log(totalTasksPending);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };


  const postTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !inputValueName.trim()) {
      alert("Por favor, ingresa tanto el nombre como el contenido de la tarea.");
      return;
    }
    setIsLoading(true);
    try {
      await createTask({
        name: inputValueName.trim(),
        content: inputValue.trim(),
        user_id: inputValueAsignUser
      });
      console.log("Task created successfully");
      setCurrentPage(1); // Volver a primera página para ver la nueva tarea
      setRefreshTrigger(prev => prev + 1); // Forzar recarga de tareas
      setInputValue("");
      setInputValueName("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error al crear la tarea. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditInputValue(task.content);
    setEditInputValueName(task.name);
    setEditInputValueStatus(task.done ? "done" : "pending");
    setEditIsDialogOpen(true);
  };

  const updateTaskHandler = async (e) => {
    e.preventDefault();
    if (!editInputValue.trim() || !editInputValueName.trim()) {
      alert("Por favor, ingresa tanto el nombre como el contenido de la tarea.");
      return;
    }
    setEditIsLoading(true);
    try {
      await updateTask(selectedTask.id, {
        content: editInputValue.trim(),
        name: editInputValueName.trim(),
        done: editInputValueStatus === "done",
      });
      setCurrentPage(1); // Recargar desde primera página
      setRefreshTrigger(prev => prev + 1); // Forzar recarga de tareas
      setEditInputValue("");
      setEditInputValueName("");
      setEditInputValueStatus("");
      setEditIsDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error al actualizar la tarea. Inténtalo de nuevo.");
    } finally {
      setEditIsLoading(false);
    }
  };

  const handleDelete = async (task) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        await deleteTask(task.id);
        setCurrentPage(1); // Recargar desde primera página
        setRefreshTrigger(prev => prev + 1); // Forzar recarga de tareas
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error al eliminar la tarea. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 p-10  h-full w-full">
      <div className="flex flex-row justify-between items-center">
        <Title h1="Tareas" p="Administra tus tareas aquí" />
        <AddTask
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          postTask={postTask}
          inputValueName={inputValueName}
          setInputValueName={setInputValueName}
          inputValueAsignUser={inputValueAsignUser}
          setInputValueAsignUser={setInputValueAsignUser}
          users={users}
        />
      </div>
      {/* Search Input */}
      <div className="flex justify-center w-full mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar tareas por nombre o contenido..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-row gap-10 justify-center w-full">
        <StatsCard
          data={totalTasksPending}
          title="Tareas pendientes"
        />
        <StatsCard
          data={totalTasksDone}
          title="Tareas completadas"
        />

        <StatsCard data={totalTasks} color="blue" title="Total de tareas" />
      </div>
      <div className="border  p-4 rounded-2xl bg-chart-5">
        <TableTasks tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <EditTask
        isDialogOpen={editIsDialogOpen}
        setIsDialogOpen={setEditIsDialogOpen}
        inputValue={editInputValue}
        setInputValue={setEditInputValue}
        isLoading={editIsLoading}
        postTask={updateTaskHandler}
        inputValueName={editInputValueName}
        setInputValueName={setEditInputValueName}
        inputValueStatus={editInputValueStatus}
        setInputValueStatus={setEditInputValueStatus}
      />
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-sidebar-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages || 1} | Total: {totalTasks}
        </span>
        <button 
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-sidebar-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Tasks;
