// Mock fetch globally before tests
global.fetch = jest.fn();

import Projects.js from './Projects.js'; 

describe('fetchProjects function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches projects successfully', async () => {
    const mockProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockProjects),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    const setProjectsMock = jest.fn();

    // Replace setProjects with your actual state setter function
    // Mocking useState to observe its behavior
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setProjectsMock]);

    // Render your component or call fetchProjects function
    await YourComponent.fetchProjects();

    // Ensure fetch is called with the correct URL
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8001/project/getprojects');

    // Ensure setProjects is called with the fetched data
    expect(setProjectsMock).toHaveBeenCalledWith(mockProjects);
  });

  test('handles failed fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Render your component or call fetchProjects function
    await YourComponent.fetchProjects();

    // Ensure console.error is called with the appropriate message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch projects');
  });

  test('handles fetch error', async () => {
    const error = new Error('Network error');
    fetch.mockRejectedValueOnce(error);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Render your component or call fetchProjects function
    await YourComponent.fetchProjects();

    // Ensure console.error is called with the appropriate error message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching projects:', error);
  });
});

///////////////

describe('handleConfirmCreateProject function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('creates a project successfully', async () => {
    const projectId = '123';
    const projectName = 'Test Project';
    const handleCloseDialog = jest.fn();
    const setProjectId = jest.fn();
    const setProjectName = jest.fn();
    const fetchProjectsWithId = jest.fn();
    const handleOpenSnackbar = jest.fn();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}), // Mock response JSON
    });

    await ProjectManager.handleConfirmCreateProject(
      projectId,
      projectName,
      handleCloseDialog,
      setProjectId,
      setProjectName,
      fetchProjectsWithId,
      handleOpenSnackbar
    );

    // Ensure fetch is called with the correct payload and URL
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8001/project/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: projectId,
        projectName: projectName,
      }),
    });

    // Ensure the success handling functions are called
    expect(fetchProjectsWithId).toHaveBeenCalled();
    expect(handleCloseDialog).toHaveBeenCalled();
    expect(setProjectId).toHaveBeenCalledWith('');
    expect(setProjectName).toHaveBeenCalledWith('');
  });

  test('handles server error', async () => {
    const handleCloseDialog = jest.fn();
    const setProjectId = jest.fn();
    const setProjectName = jest.fn();
    const fetchProjectsWithId = jest.fn();
    const handleOpenSnackbar = jest.fn();

    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    await ProjectManager.handleConfirmCreateProject(
      '123',
      'Test Project',
      handleCloseDialog,
      setProjectId,
      setProjectName,
      fetchProjectsWithId,
      handleOpenSnackbar
    );

    // Ensure appropriate error handling functions are called
    expect(handleOpenSnackbar).toHaveBeenCalledWith('Failed to Create Project');
    expect(handleCloseDialog).toHaveBeenCalled();
    expect(setProjectId).toHaveBeenCalledWith('');
    expect(setProjectName).toHaveBeenCalledWith('');
  });

  test('handles network error', async () => {
    const handleCloseDialog = jest.fn();
    const setProjectId = jest.fn();
    const setProjectName = jest.fn();
    const fetchProjectsWithId = jest.fn();
    const handleOpenSnackbar = jest.fn();

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await ProjectManager.handleConfirmCreateProject(
      '123',
      'Test Project',
      handleCloseDialog,
      setProjectId,
      setProjectName,
      fetchProjectsWithId,
      handleOpenSnackbar
    );

    // Ensure network error handling functions are called
    expect(handleOpenSnackbar).toHaveBeenCalledWith('Failed to Create Project');
    expect(handleCloseDialog).toHaveBeenCalled();
    expect(setProjectId).toHaveBeenCalledWith('');
    expect(setProjectName).toHaveBeenCalledWith('');
  });
});

///////////////////
// Mocking localStorage.setItem
let setItemSpy;
beforeEach(() => {
  setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
});

import { joinProject } from './Project.js'; 

describe('joinProject function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns without joining if user is not logged in', async () => {
    // Mock localStorage.getItem to return null
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    const result = await joinProject('project123');

    // Ensure the function returns without joining if user is not logged in
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('User ID is not available. User must be logged in to join a project.');
  });

  test('returns without joining if user ID is not available', async () => {
    // Mock localStorage.getItem to return user data without UserID
    const userData = { username: 'testUser', email: 'test@example.com' };
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(userData));

    const result = await joinProject('project123');

    // Ensure the function returns without joining if UserID is not available
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('User ID is not available. User must be logged in to join a project.');
  });

  test('joins project when user is logged in', async () => {
    // Mock localStorage.getItem to return user data with UserID
    const userData = { UserID: 'userID123', username: 'testUser', email: 'test@example.com' };
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(userData));

    const result = await joinProject('project123');

    // Ensure the function joins the project when the user is logged in
    expect(setItemSpy).toHaveBeenCalledWith('project_user_project123', 'userID123');
    // Add more expectations or assertions based on your joinProject function behavior
  });
});
