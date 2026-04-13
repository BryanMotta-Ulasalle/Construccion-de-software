import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon } from "lucide-react";

const TableTasks = ({ tasks, onEdit, onDelete }) => {

    const normalizeStatus = (status) => {
        if (typeof status === "boolean") {
          return status ? "Done" : "Pending";
        }
        return "Unknown";
    };

    return (
    <Table>
      <TableHeader>
        <TableRow className="text-xl">
          <TableHead>No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-lg">
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{tasks.indexOf(task) + 1}</TableCell>
            <TableCell>{task.name}</TableCell>
            <TableCell>{task.content}</TableCell>
            <TableCell>{normalizeStatus(task.done)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(task)}>
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableTasks;
