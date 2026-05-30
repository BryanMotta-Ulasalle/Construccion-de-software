import React, { useEffect, useState, useContext  } from 'react'
import { TableUsers } from '../components/my_ui/TableUsers'
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.services';
import AddUser from '../components/my_ui/AddUser';
import Title from '../components/my_ui/Title';
import StatsCard from '../components/my_ui/StatsCard';
import { Edit } from 'lucide-react';
import EditUser from '../components/my_ui/EditUser';
import {UserContext} from "../context/UserContext"

const Users = () => {

  const {users, setUsers }= useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false)
  const [inputValueName, setInputValueName] = useState("")
  const [inputValueEmail, setInputValueEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null);
  const [editIsDialogOpen, setEditIsDialogOpen] = useState(null);

   const [refreshTrigger, setRefreshTrigger] = useState(0);


  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers();
        console.log(res.data);
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    loadUsers();

  }, [refreshTrigger])

  async function postUser(e) {
    e.preventDefault();
    if (!inputValueName.trim() || !inputValueEmail.trim()) {
      return "Nombre y email no deben estar vacios"
    }
    setIsLoading(true)
    try {
      await createUser({
        name: inputValueName.trim(),
        email: inputValueEmail.trim()
      })
      setInputValueName("")
      setInputValueEmail("")
      setIsDialogOpen(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      return "error al crear usuario"
    } finally {
      setIsLoading(true)
    }
  }

  const HandleEdit = (user) => {
    setSelectedUser(user);
    setInputValueName(user.name)
    setInputValueEmail(user.email)
    setEditIsDialogOpen(true);
  }

  async function putUser(e) {
    e.preventDefault();
    if (!inputValueName.trim() || !inputValueEmail.trim()) {
      return "Nombre y email no deben estar vacios"
    }
    setIsLoading(true)
    try {
      await updateUser(selectedUser.id, {
        name: inputValueName.trim(),
        email: inputValueEmail.trim()
      })
      setInputValueName("")
      setInputValueEmail("")
      setEditIsDialogOpen(false);
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      return "Error al actualizar usuario"
    }finally {
      setIsLoading(false)
      
    }
  }

  async function userDelete(user) {
    if (window.confirm("¿Seguro que deseasa eliminar el usuario?")){
      try {
        await deleteUser(user.id)
        setRefreshTrigger(prev => prev + 1)
        console.log(user.id)
      } catch (error) {
        return "Error al eliminar usuario"
      }
    }

  }

  return (
    <div className="flex flex-col gap-10 p-10  h-full w-full">
      <div className="flex flex-row justify-between items-center">
        <Title h1="Usuarios" p="Administra tus usuarios aquí" />

        <AddUser isLoading={isLoading} inputValueName={inputValueName} inputValueEmail={inputValueEmail}
          setInputValueName={setInputValueName} setInputValueEmail={setInputValueEmail} isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen} postUser={postUser} />
      </div>

      <div className="flex flex-row gap-10 justify-center w-full">
        <StatsCard data={users.length} color="blue" title="Total de usuarios" />
      </div>

      <TableUsers users={users} onEdit={HandleEdit} onDelete={userDelete} />

      <EditUser isDialogOpen={editIsDialogOpen} setIsDialogOpen={setEditIsDialogOpen} inputValueName={inputValueName} setInputValueName={setInputValueName}
        inputValueEmail={inputValueEmail} setInputValueEmail={setInputValueEmail} isLoading={isLoading} postUser={putUser} />
    </div>
  )
}

export default Users