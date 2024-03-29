import PinnedProjects from "./components/pinnedProjects";

interface Props {
  username: string;
}

const ProfileOverview = ({ username }: Props) => {
  return (
    <div>
      <PinnedProjects username={username} />
    </div>
  );
};

export default ProfileOverview;