import { FieldGroup, Field, FieldLabel } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const EditTask = ({ isDialogOpen, setIsDialogOpen, inputValue, setInputValue, isLoading, postTask, inputValueName, setInputValueName, inputValueStatus, setInputValueStatus }) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Tarea</DialogTitle>
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
                                <FieldLabel htmlFor="status">Status</FieldLabel>
                                <Select value={inputValueStatus} onValueChange={(value) => setInputValueStatus(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Actualizando...' : 'Actualizar'}
                            </Button>
                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>
  )
}

export default EditTask