import PinnedProjects from "./pinnedProjects";

const ProfileOverview = ({ username }) => {
  return (
    <div>
      <PinnedProjects username={username} />
    </div>
  );
};

export default ProfileOverview;