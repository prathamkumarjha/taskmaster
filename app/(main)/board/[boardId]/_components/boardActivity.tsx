import { ACTION, ENTITY_TYPE } from "@prisma/client";
import Image from "next/image";

// Define the interface for a log entry
interface Log {
  id: string;
  action: ACTION;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userName: string;
  userImage: string;
  createdAt: Date;
  cardId: string | null; // Optional field
  boardId: string;
}

// Function to format a single log entry into a readable notification string
const createNotification = (log: Log): string => {
  const { action, entityType, entityTitle, userName, createdAt, userImage } =
    log;

  let actionVerb = "";
  switch (action) {
    case ACTION.CREATE:
      actionVerb = "created";
      break;
    case ACTION.UPDATE:
      actionVerb = "updated";
      break;
    case ACTION.DELETE:
      actionVerb = "deleted";
      break;
    case ACTION.MOVE:
      actionVerb = "moved";
      break;
    case ACTION.MARK:
      actionVerb = "marked";
      break;
    case ACTION.UNMARK:
      actionVerb = "unmarked";
      break;
    case ACTION.COMMENT:
      actionVerb = "commented on";
      return `${userName} ${actionVerb} a ${entityType.toLowerCase()} titled "${entityTitle}"`;
    case ACTION.JOINED:
      actionVerb = "joined";
      break;
    case ACTION.LEFT:
      actionVerb = "left";
      break;
    default:
      actionVerb = "performed an action on";
  }

  switch (entityType) {
    case ENTITY_TYPE.LABEL:
      return `${userName} ${actionVerb} a label on card "${entityTitle}"`;
    case ENTITY_TYPE.CHECKLIST:
      return `${userName} ${actionVerb} a checklist titled "${entityTitle}"`;
    case ENTITY_TYPE.TODO:
      return `${userName} ${actionVerb} a todo titled "${entityTitle}"`;
    case ENTITY_TYPE.MEMBER:
      return `${userName} ${actionVerb} as a member`;
    case ENTITY_TYPE.DATE:
      return `${userName} updated the due date`;
    case ENTITY_TYPE.CARD:
      return `${userName} ${actionVerb} a card titled "${entityTitle}"`;
    case ENTITY_TYPE.LIST:
      return `${userName} ${actionVerb} a list titled "${entityTitle}"`;
    default:
      return `${userName} ${actionVerb} a ${entityType.toLowerCase()} titled "${entityTitle}"`;
  }
};

// Function to create a list of formatted activity logs
const BoardActivity = ({ logs }: { logs: Log[] }) => {
  return (
    <div className="w-full">
      <div className="sticky text-xl font-semibold my-4">Activity Log</div>
      <ul>
        {logs.map((log) => (
          <li
            key={log.id}
            className="mb-4  flex items-center space-x-4 text-sm text-gray-300 cursor-pointer "
          >
            {/* User Image */}
            {/* <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700"> */}
            <Image
              src={log.userImage}
              alt={`${log.userName} avatar`}
              width={25}
              height={25}
              className="object-cover rounded-full"
            />
            {/* </div> */}
            {/* Notification Text */}
            <div className="space-x-2">
              {/* <span className="text-lg font-medium">{log.userName}</span> */}
              <span className="text-md">{createNotification(log)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardActivity;
