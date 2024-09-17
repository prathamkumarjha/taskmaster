import { ACTION, ENTITY_TYPE } from "@prisma/client";
import Image from "next/image";

// Define the interface for a log entry
interface LogEntry {
  id: string;
  action: ACTION;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userName: string;
  userImage: string; // New field for the user's image
  createdAt: string;
}

// Props interface for the ActivityLog component
interface ActivityLogProps {
  logs: LogEntry[];
}

// Function to format a single log entry into a readable notification string
const createNotification = (log: LogEntry): string => {
  const { action, entityType, entityTitle, userName, createdAt } = log;

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
      actionVerb = "commented";
      return ` commented `;
      break;
    case ACTION.JOINED:
      actionVerb = "joined";
      break;
    case ACTION.LEFT:
      actionVerb = "left";
      break;
    default:
      actionVerb = "performed an action on";
  }

  const formattedDate = new Date(createdAt).toLocaleString();

  switch (entityType) {
    case ENTITY_TYPE.LABEL:
      return `${actionVerb} a label`;
    case ENTITY_TYPE.CHECKLIST:
      return `${actionVerb} a ${entityType.toLowerCase()} titled "${entityTitle}"`;
    case ENTITY_TYPE.TODO:
      return `${actionVerb} a ${entityType.toLowerCase()} title ${entityTitle}`;
    case ENTITY_TYPE.MEMBER:
      return `${actionVerb}  `;
    case ENTITY_TYPE.DATE:
      return "updated  due date";
    case ENTITY_TYPE.CARD:
      return `${actionVerb} this card`;
    default:
      return ` ${actionVerb} a ${entityType.toLowerCase()} titled "${entityTitle}" on "${entityTitle}"`;
  }
  // return entityType != ENTITY_TYPE.CARD
  //   ? ` ${actionVerb} a ${entityType.toLowerCase()} titled "${entityTitle}" on "${entityTitle}"`
  //   : ` ${actionVerb}`;
};

// ActivityLog component
export const ActivityLog = ({ logs }: ActivityLogProps) => {
  return (
    <div className="activity-log">
      <h2 className="text-xl font-semibold mb-2">Activity Log</h2>
      <ul>
        {logs?.map((log: LogEntry) => (
          <li
            key={log.id}
            className="mb-4 flex items-center space-x-4 text-sm text-gray-300"
          >
            {/* User Image */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
              <Image
                src={log.userImage}
                alt={`${log.userName} avatar`}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            {/* Notification Text */}
            <div className="space-x-2">
              <span className="text-lg">{log.userName}</span>
              <span className="text-md">{createNotification(log)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
