import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { FieldGroup, Field, FieldLabel } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AddTask = ({ isDialogOpen, setIsDialogOpen, inputValue, setInputValue, isLoading, postTask, inputValueName, setInputValueName, inputValueAsignUser, setInputValueAsignUser, users }) => {
  
    return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-chart-1 text-white text-2xl cursor-pointer hover:bg-chart-1/80" size='lg'>+ Add Task</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Tarea</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={postTask}>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={inputValueName}
                                    onChange={(e) => setInputValueName(e.target.value)}
                                    placeholder="Ingresa el nombre de la tarea"
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="content">Contenido</Label>
                                <Input
                                    id="content"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ingresa el contenido de la tarea"
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="user_id">Assign user</FieldLabel>
                                <Select value={inputValueAsignUser} onValueChange={(value) => setInputValueAsignUser(value)}>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Selecciona un usuario"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creando...' : 'Crear'}
                            </Button>
                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>
  )
}

export default AddTask