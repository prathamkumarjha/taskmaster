import { CheckList } from "./CheckList";
import { Dates } from "./Dates";
import { Labels } from "./Labels";
import { Members } from "./Members";

export interface memberInterface {
  id: string;
  name: string;
  designation: string;
  image: string;
}

export const AddToCard = ({
  cardId,
  members,
}: {
  cardId: string;
  members: memberInterface[];
}) => {
  return (
    <div className="ml-0 mt-4 pt-8">
      <div>Add to card</div>
      <Members cardId={cardId} assigned={members} />
      <Labels cardId={cardId} />
      <CheckList cardId={cardId} />
      <Dates />
    </div>
  );
};
