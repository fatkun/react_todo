import { Task } from "@/app/types";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface TaskListProps {
    tasks: Task[],
    deleteTask: any,
    editTask: any,
}

export function TaskList({tasks, deleteTask, editTask}: TaskListProps) {
    return (
        <div>
            {tasks.length === 0 && <Text size="lg" style={{ textAlign: 'center' }}>No tasks</Text>}
            {tasks.map((task: Task) => {
                return (
                    <Card shadow="sm" mb={10} radius="md" withBorder key={task.id}>
                        <Group justify='space-between'>
                            <Text fw={700} size="lg" className={task.done ? "task_done" : ""}>{task.title}</Text>
                            <Group justify="flex-end">
                                <ActionIcon onClick={()=> {
                                    editTask(task.id);
                                }} color="blue" variant={'transparent'}>
                                    <IconEdit/>
                                </ActionIcon>
                                <ActionIcon onClick={()=> {
                                    deleteTask(task.id);
                                }} color="red" variant={'transparent'}>
                                    <IconTrash/>
                                </ActionIcon>
                            </Group>
                        </Group>
                        
                        <Text c="dimmed" size="sm" >{task.summary ? task.summary : "..."}</Text>
                    </Card>
                );
            })}
        </div>
    );
}