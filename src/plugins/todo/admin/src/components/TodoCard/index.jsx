import React, { useState, useEffect } from "react";

import { useCMEditViewDataManager } from "@strapi/helper-plugin";

import axiosInstance from "../../utils/axiosInstance";

import {
  Box,
  Typography,
  Divider,
  Checkbox,
  Stack,
  Flex,
  Icon,
} from "@strapi/design-system";

import Plus from "@strapi/icons/Plus";

import TaskModal from "../TaskModal";

const TodoCard = () => {
  const { initialData } = useCMEditViewDataManager();

  const [tasks, setTasks] = useState(initialData.tasks);
  const [settings, setSettings] = useState(false);

  const [createModalIsShown, setCreateModalIsShown] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get(`todo/settings`);
      setSettings(data.body.disabled);
    } catch (e) {
      console.log(e);
    }
  };

  const updateTasks = async (taskId) => {
    try {
      let updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isDone: !task.isDone };
        }
        return task;
      });

      setTasks(updatedTasks);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [settings]);

  const toggleTask = async (taskId, isChecked) => {
    // Update task in database
    const res = await axiosInstance.put(`/todo/update/${taskId}`, {
      data: {
        isDone: isChecked,
      },
    });
    console.log(res);
    if (res.status === 200) await updateTasks(taskId, isChecked);
  };

  const showTasks = () => {
    // Loading state
    if (status === "loading") {
      return <p>Fetching todos...</p>;
    }

    // Error state
    if (status === "error") {
      return <p>Could not fetch tasks.</p>;
    }

    // Empty state
    if (tasks == null || tasks.length === 0) {
      return <p>No todo yet.</p>;
    }

    // Success state, show all tasks
    return tasks.map((task) => (
      <>
        <Checkbox
          value={task.isDone}
          onValueChange={(isChecked) => toggleTask(task.id, isChecked)}
          key={task.id}
          disabled={task.isDone && settings ? true : false}
        >
          <span
            style={{
              textDecoration:
                task.isDone && settings == false ? "line-through" : "none",
            }}
          >
            {task.name}
          </span>
        </Checkbox>
      </>
    ));
  };

  return (
    <>
      {createModalIsShown && (
        <TaskModal
          handleClose={() => setCreateModalIsShown(false)}
          setTasks={setTasks}
          tasks={tasks}
        />
      )}
      <Box
        as="aside"
        aria-labelledby="additional-informations"
        background="neutral0"
        borderColor="neutral150"
        hasRadius
        paddingBottom={4}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={3}
        shadow="tableShadow"
      >
        <Typography
          variant="sigma"
          textColor="neutral600"
          id="additional-informations"
        >
          Todos
        </Typography>
        <Box paddingTop={2} paddingBottom={6}>
          <Box paddingBottom={2}>
            <Divider />
          </Box>
          <Typography
            fontSize={2}
            textColor="primary600"
            as="button"
            type="button"
            onClick={() => setCreateModalIsShown(true)}
          >
            <Flex>
              <Icon
                as={Plus}
                color="primary600"
                marginRight={2}
                width={3}
                height={3}
              />
              Add todo
            </Flex>
          </Typography>

          <Stack paddingTop={3} size={2}>
            {showTasks()}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default TodoCard;
