import { IoMdCheckboxOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useStore } from "@/hooks/use-refetch-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CheckListInterface {
  checkListId: string;
  name: string;
  todos: {
    todoId: string;
    name: string;
    done: boolean;
    checkListId: string;
  }[];
  cardId: string;
}

const CheckList: React.FC<{ checkList: CheckListInterface }> = ({
  checkList,
}) => {
  const [isChangeListname, setChangeListname] = useState(false);
  const [listName, setListName] = useState(checkList.name);
  const { refresh, setRefresh } = useStore();
  const [taskName, setTaskName] = useState("");

  const onSubmitTask = async () => {
    try {
      await axios.post(`/api/card/${checkList.cardId}/checkListItem`, {
        taskName,
        checkListId: checkList.checkListId,
      });
    } catch (error) {
      console.log("failed to create a new task in checklist", error);
    } finally {
      console.log("task created");
      setRefresh(true);
    }
  };
  const onSubmitName = async () => {
    try {
      if (checkList.name != listName) {
        const data = await axios.patch(
          `/api/card/${checkList.cardId}/checkList`,
          {
            checkListName: listName,
            checkListId: checkList.checkListId,
          }
        );
        console.log(data);
      }
    } catch (error) {
      console.log("listname update failed with error ", error);
    } finally {
      setRefresh(true);
    }
  };

  const onDeleteName = async () => {
    try {
      await axios.delete(`/api/card/${checkList.cardId}/checkList`, {
        params: {
          checkListId: checkList.checkListId,
        },
      });
    } catch (error) {
      console.log("Checklist deletion failed", error);
    } finally {
      setRefresh(true);
    }
  };

  const handleCheckboxChange = async (todoId: string, checked: boolean) => {
    try {
      axios.put(`/api/card/${checkList.cardId}/checkListItem`, {
        todoId,
        checked,
      });
    } catch (error) {
      console.log("checkListItem update failed", error);
    } finally {
      console.log("checkList item update completed");
      setRefresh(true);
    }
  };

  const deleteCheckListItem = async (todoId: string) => {
    try {
      await axios.delete(`/api/card/${checkList.cardId}/checkListItem`, {
        params: {
          todoId,
        },
      });
    } catch (error) {
      console.log("cant delete", error);
    } finally {
      setRefresh(true);
    }
  };

  return (
    <div className="mb-4 border-y  p-2 border-gray-500 rounded-lg w-80">
      <div className="relative flex items-center w-80 mb-2">
        <IoMdCheckboxOutline />
        {isChangeListname ? (
          <div className="space-x-2 space-y-2 ml-2">
            <Input
              className=" bg-gray-600"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            ></Input>
            <Button
              className="bg-blue-500 hover:bg-blue-500 hover:opacity-75"
              onClick={() => {
                onSubmitName();
              }}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => setChangeListname(false)}
            >
              <RxCross1 className="text-white" />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              className="text-lg text-white"
              variant="link"
              onClick={() => setChangeListname(true)}
            >
              {checkList.name}
            </Button>
            <Button
              variant="destructive"
              className="absolute right-0 bg-gray-600 hover:bg-gray-600 hover:opacity-75 text-red-500 pr-2 mr-3"
              onClick={() => onDeleteName()}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      {checkList.todos.map((todo) => (
        <div key={todo.todoId} className="flex justify-between">
          <div className="flex items-center ml-4">
            <input
              type="checkbox"
              id={`todo-${todo.todoId}`}
              checked={todo.done}
              onChange={() => handleCheckboxChange(todo.todoId, !todo.done)}
              className="form-checkbox h-4 w-4 text-blue-600"
              aria-label={`Mark ${todo.name} as done`}
            />
            <label htmlFor={`todo-${todo.todoId}`} className={`ml-2`}>
              <p
                className={`${todo.done ? "line-through" : ""} cursor-pointer`}
              >
                {todo.name}
              </p>
            </label>
          </div>
          <Button
            variant="link"
            className=" text-red-500 p-2 "
            onClick={() => deleteCheckListItem(todo.todoId)}
          >
            Delete
          </Button>
        </div>
      ))}
      <Popover>
        <PopoverTrigger>
          <Button className="bg-gray-600 hover:bg-gray-600 hover:opacity-75 mt-2">
            Add an Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-gray-800 border-0 shadow-lg text-white  shadow-black space-y-2">
          Add a title
          <Input
            className="bg-gray-600 mt-2"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Button onClick={() => onSubmitTask()}>Submit</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CheckList;
