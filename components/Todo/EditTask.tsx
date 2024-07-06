import { Task } from "@/app/types";
import { Button, Checkbox, Group, Modal, TextInput } from "@mantine/core";
import { useForm, hasLength } from '@mantine/form';
import { useEffect, useRef, useState } from "react";

interface EditTaskProps {
    modalOpened: boolean;
    closeModal: () => void;
    saveTask: (task: Task) => void;
    task: Task;
    setTask: (task: Task) => void;
}

export const EditTask = ({ modalOpened, closeModal, saveTask, task, setTask }: EditTaskProps) => {
    
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: task,
        validateInputOnBlur: true,
        validate: {
            title: hasLength({ min: 2 }, '标题至少两个字符'),
        }
    });


    useEffect(() => {
        console.log("task", task);
        form.setInitialValues(task);
        form.setValues(task);
    }, [task, modalOpened]);


    return (
        <Modal opened={modalOpened} onClose={closeModal} title="添加任务">
            <form onSubmit={form.onSubmit((values) => {
                saveTask(values); 
                closeModal(); 
            })}>
                <TextInput
                    {...form.getInputProps('id')}
                    key={form.key('id')}
                    style={{display: 'none'}}
                />
                <Checkbox
                {...form.getInputProps('done', { type: 'checkbox' })}
                key={form.key('done')}
                label="完成"
                />
                <TextInput
                    {...form.getInputProps('title')}
                    key={form.key('title')}
                    mt={'md'}
                    placeholder={'Task Title'}
                    required
                    label={'Title'}
                />
                <TextInput
                    {...form.getInputProps('summary')}
                    key={form.key('summary')}
                    mt={'md'}
                    placeholder={'Task Summary'}
                    label={'Summary'}
                />
                <Group mt={'md'} justify='space-between'>
                    <Button
                        onClick={() => {
                            closeModal();
                        }}
                        variant={'subtle'}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {task.id == 0 ? "Create Task" : "Update Task"}
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}
