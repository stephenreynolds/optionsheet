import ProjectCard from "../shared/projectCard";

const ProjectList = ({ projects }) => {
  return (
    <>
      {projects.map((project, key) => (
        <div key={key}>
          <ProjectCard project={project} />
        </div>
      ))}
    </>
  );
};

export default ProjectList;