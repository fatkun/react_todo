import { Task } from "@/app/types";
import { Button, Checkbox, Group, LoadingOverlay, Modal, TextInput } from "@mantine/core";
import { useForm, hasLength } from '@mantine/form';
import { useEffect, useRef, useState } from "react";

interface EditTaskProps {
    modalOpened: boolean;
    isTaskLoading: boolean;
    setIsTaskLoading: (value: boolean) => void;
    closeModal: () => void;
    saveTask: (task: Task) => Promise<string>;
    task: Task;
    setTask: (task: Task) => void;
}

export const EditTask = ({ modalOpened, isTaskLoading, setIsTaskLoading, closeModal, saveTask, task, setTask }: EditTaskProps) => {
    
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: task,
        validateInputOnBlur: true,
        validate: {
            title: hasLength({ min: 2 }, '标题至少两个字符'),
        }
    });


    // 通过指定监控对象的变化，会执行第一个方法
    useEffect(() => {
        console.log("task", task);
        form.setInitialValues(task);
        form.setValues(task);
    }, [task, modalOpened]);


    return (
        <Modal opened={modalOpened} onClose={closeModal} closeOnClickOutside={false} closeOnEscape={false} title={task.id == 0 ? "Create Task" : "Update Task"}>
            <LoadingOverlay visible={isTaskLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={form.onSubmit((values) => {
                setIsTaskLoading(true);
                saveTask(values).then((result) => {
                    setIsTaskLoading(false);
                    closeModal();
                });
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
