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
  const [isTaskLoading, setIsTaskLoading] = useState<boolean>(false);

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

  const saveTask = (task: Task): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 模拟保存时间
      setTimeout(() => {
        let newTasks = [];
        if (task.id === 0) {
          task.id = new Date().getTime();
          newTasks = [...tasks, task];
        } else {
          newTasks = tasks.map((t) => t.id === task.id ? task : t);
        }
        setTasks(newTasks);
        saveTasks(newTasks);
        resolve("success");

        console.log("saveTask", task);
      }, 200);
    })
  }

  const addOrEditTask = (id: number) => {
    if (id == 0) {
      setTask({id: 0, title: "", summary: "", done: false});
    } else {
      setIsTaskLoading(true);
      // 从远程加载数据
      setTask({id: 0, title: "", summary: "", done: false});
      loadTask(id).then(t => {
        setTask(t);
        setIsTaskLoading(false);
      }).catch(e => {
        console.log(e);
        alert(e);
        setIsTaskLoading(false);
        closeModal();
      });
    }
    openModal();
  }

  function loadTask(id : number): Promise<Task> {
    return new Promise((resolve, reject) => {
      // 模拟加载时间
      setTimeout(() => {
        let success = true;
        if (success) {
          let loadedTasks = localStorage.getItem('tasks');
          let tasks = JSON.parse(loadedTasks || "[]");
          let task = tasks.filter((task: { id: number}) => task.id === id)[0];
          resolve(task);
        } else {
          reject("error");
        }
      }, 300);
    });
    
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
      <EditTask modalOpened={modalOpened} isTaskLoading={isTaskLoading} setIsTaskLoading={setIsTaskLoading} task={task} setTask={setTask} closeModal={closeModal} saveTask={saveTask} />
      <Container size={550} pos="relative">
        <LoadingOverlay visible={isAllTasksLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <TaskHeader toggleColorScheme={toggleColorScheme} colorScheme={colorScheme}></TaskHeader>
        <TaskList tasks={tasks} editTask={addOrEditTask} deleteTask={deleteTask} isAllTasksLoading={isAllTasksLoading}></TaskList>
        <Button onClick={() => addOrEditTask(0)} fullWidth mt={'md'}>New Task</Button>
      </Container>
    </>
  );
}
