import BoardActivity from "@/app/(main)/board/[boardId]/_components/boardActivity";
import prismadb from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import Image from "next/image";
import { User, Activity, columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { auth } from "@clerk/nextjs";
// Existing Log Type (for reference)
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

// Function to create notification message
const createNotification = (
  log: Log,
  boardMap: {
    [key: string]: string;
  }
): string => {
  const { action, entityType, entityTitle, userName } = log;

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

// Mapping Log to Activity
const mapLogToActivity = (
  log: Log,
  boardMap: { [key: string]: string }
): Activity => {
  return {
    id: log.id,
    dateAndTime: log.createdAt.toISOString(),
    user: {
      name: log.userName,
      ImageUrl: log.userImage,
    } as User,
    change: createNotification(log, boardMap),
    boardName: boardMap[log.boardId] || "Unknown board",
  };
};

export default async function Page({
  params,
}: {
  params: { organizationId: string };
}) {
  // Fetch logs
  const { orgId } = auth();
  const logs = await prismadb.audit_log.findMany({
    where: {
      orgId: params.organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch boards and create a map of boardId to boardName
  const boards = await prismadb.board.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });
  const boardMap = boards.reduce((acc: { [key: string]: string }, board) => {
    acc[board.id] = board.name;
    return acc;
  }, {});

  // Map logs to activities
  const activities: Activity[] = logs.map((log) =>
    mapLogToActivity(log, boardMap)
  );

  return (
    <div className="w-full mr-8  mt-20 flex justify-center px-4">
      <DataTable columns={columns} data={activities} />
    </div>
  );
}
