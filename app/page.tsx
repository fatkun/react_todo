"use client";
import { ActionIcon, Button, Container, Group, LoadingOverlay, Title, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { TaskList } from '@/components/Todo/TaskList';
import { Task } from './types';
import {EditTask} from '@/components/Todo/EditTask';
import React from 'react';
import TaskHeader from '@/components/Todo/TaskHeader';
import useSWR from 'swr';

export default function HomePage() {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [task, setTask] = useState<Task>({} as Task);

  const [tasks, setTasks] = useState<Task[]>([]);
  const { setColorScheme } = useMantineColorScheme();

  const [colorScheme, saveColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value: any) => {
    let color = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(color);
    saveColorScheme(color);
  }

  const deleteTask = (id: number) => {
    let newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  }

  const saveTask = (task: Task) => {
    let newTasks = [];
    if (task.id === 0) {
      task.id = new Date().getTime();
      newTasks = [...tasks, task];
    } else {
      newTasks = tasks.map((t) => t.id === task.id ? task : t);
    }
    setTasks(newTasks);
    saveTasks(newTasks);
  }

  const addOrEditTask = (id: number) => {
    if (id == 0) {
      setTask({id: 0, title: "", summary: "", done: false});
    } else {
      // 从远程加载数据
      setTask(tasks.filter((task) => task.id === id)[0]);
    }
    openModal();
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem('tasks');
    let tasks = JSON.parse(loadedTasks || "[]");
    setTasks(tasks);
  }

  // 使用swr加载数据，增加loading信息
  const { data, error, isLoading : isAllTasksLoading } = useSWR('/api/tasks', loadTasks);

  function saveTasks(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  return (
    <>
      <EditTask modalOpened={modalOpened} task={task} setTask={setTask} closeModal={closeModal} saveTask={saveTask} />
      <Container size={550} pos="relative">
        <LoadingOverlay visible={isAllTasksLoading || isSavingTask} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <TaskHeader toggleColorScheme={toggleColorScheme} colorScheme={colorScheme}></TaskHeader>
        <TaskList tasks={tasks} editTask={addOrEditTask} deleteTask={deleteTask} isAllTasksLoading={isAllTasksLoading}></TaskList>
        <Button onClick={() => addOrEditTask(0)} fullWidth mt={'md'}>New Task</Button>
      </Container>
    </>
  );
}
