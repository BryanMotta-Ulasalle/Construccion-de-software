import { FieldGroup, Field, FieldLabel } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';

const EditUser = ({ isDialogOpen, setIsDialogOpen, inputValueName, setInputValueName, inputValueEmail, setInputValueEmail, isLoading, postUser }) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
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
                                <Label htmlFor="content">Email</Label>
                                <Input
                                    id="email"
                                    value={inputValueEmail}
                                    onChange={(e) => setInputValueEmail(e.target.value)}
                                    placeholder="Ingresa el email del usuario"
                                    disabled={isLoading}
                                />
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

export default EditUser