import React, { useState } from 'react';

const Dashboard = () => {
  const [projects, setProjects] = useState([
    { projectID: '1', projectName: 'HWSet1', description: 'Hardware Set 1', capacity: 10, availability: 5 },
    { projectID: '2', projectName: 'HWSet2', description: 'Hardware Set 2', capacity: 8, availability: 2 },
  ]);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectCreation = (projectName, description, projectID) => {
    const newProject = { projectName, description, projectID, capacity: 0, availability: 0 };
    setProjects([...projects, newProject]);
  };

  const handleProjectSelection = (projectID) => {
    const project = projects.find((p) => p.projectID === projectID);
    setSelectedProject(project);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Project Creation Section */}
      <div>
        <h2>Create New Project</h2>
        {/* Here you will have your form to create a new project */}
      </div>

      {/* Existing Projects Section */}
      <div>
        <h2>Existing Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.projectID} onClick={() => handleProjectSelection(project.projectID)}>
              {project.projectName}
            </li>
          ))}
        </ul>
      </div>

      {/* Project Details Section */}
      {selectedProject && (
        <div>
          <h2>Project Details</h2>
          <p>Project ID: {selectedProject.projectID}</p>
          <p>Project Name: {selectedProject.projectName}</p>
          <p>Description: {selectedProject.description}</p>
          <p>Capacity: {selectedProject.capacity}</p>
          <p>Availability: {selectedProject.availability}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
