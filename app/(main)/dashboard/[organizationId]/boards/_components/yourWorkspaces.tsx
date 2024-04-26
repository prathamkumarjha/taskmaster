interface WorkspaceProps {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
}

const YourWorkspaces: React.FC<{ workspaces: WorkspaceProps[] }> = ({
  workspaces,
}) => {
  return (
    <div>
      {workspaces.map((workspace) => (
        <div key={workspace.id}>
          <p>{workspace.organizationId}</p>
          {/* Add more details here as needed */}
        </div>
      ))}
    </div>
  );
};

export default YourWorkspaces;
