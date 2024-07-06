import { Task } from "@/app/types";
import { ActionIcon, Card, Group, Menu, Text, rem } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface TaskListProps {
    tasks: Task[],
    deleteTask: any,
    editTask: any,
    isAllTasksLoading: boolean,
}

export function TaskList({tasks, deleteTask, editTask, isAllTasksLoading}: TaskListProps) {
    return (
        <div>
            {isAllTasksLoading && <Text size="lg" style={{ textAlign: 'center' }}>Loading...</Text>}
            {!isAllTasksLoading && tasks.length === 0 && <Text size="lg" style={{ textAlign: 'center' }}>No tasks</Text>}
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
                                <Menu withArrow>
                                    <Menu.Target>
                                        <ActionIcon color="red" variant={'transparent'}>
                                            <IconTrash/>
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item 
                                        color="red"
                                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                        onClick={() => {
                                            deleteTask(task.id);
                                        }}>确认删除</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Group>
                        
                        <Text c="dimmed" size="sm" >{task.summary ? task.summary : "..."}</Text>
                    </Card>
                );
            })}
        </div>
    );
}