import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { FieldGroup, Field } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const AddUser = ({ isDialogOpen, setIsDialogOpen, inputValueEmail, setInputValueEmail, isLoading, postUser, inputValueName, setInputValueName }) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-chart-1 text-white text-2xl cursor-pointer hover:bg-chart-1/80" size='lg'>+ Add User</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={postUser}>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={inputValueName}
                                    onChange={(e) => setInputValueName(e.target.value)}
                                    placeholder="Ingresa el nombre del usuario"
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={inputValueEmail}
                                    onChange={(e) => setInputValueEmail(e.target.value)}
                                    placeholder="Ingresa el email del usuario"
                                    disabled={isLoading}
                                />
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

export default AddUser