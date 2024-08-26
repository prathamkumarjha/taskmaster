import { CheckList } from "./CheckList";
import { Dates } from "./Dates";
import { Labels } from "./Labels";
import { Members } from "./Members";

export const AddToCard = () => {
  return (
    <div className="ml-0 mt-4 pt-8">
      <div>Add to card</div>
      <Members />
      <Labels />
      <CheckList />
      <Dates />
    </div>
  );
};
