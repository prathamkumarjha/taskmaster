import { IoMdCheckboxOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useStore } from "@/hooks/use-refetch-data";
axios;
export interface CheckListInterface {
  checkListId: string;
  name: string;
  todos: {
    todoId: string;
    name: string;
    done: Boolean;
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

  return (
    <div className="mb-4">
      <div className="relative flex items-center  space-x-2 w-80 mb-2">
        <IoMdCheckboxOutline />
        {isChangeListname ? (
          <div className="space-x-2 space-y-2">
            <Input
              className=" bg-gray-600"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            ></Input>
            <Button
              className="bg-blue-500 hover:bg-blue-500 hover:opacity_75"
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
              className="absolute right-0 bg-gray-600 hover:bg-gray-600 hover:opacity-75 text-red-500"
              onClick={() => onDeleteName()}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      <Button className="bg-gray-600 hover:bg-gray-600 hover:opacity-75">
        Add an Item
      </Button>
    </div>
  );
};

export default CheckList;
