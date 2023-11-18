#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from project_routes import join_project_route
from unittest.mock import patch



# Mocking the request and jsonify
@patch('project_routes.request')
@patch('project_routes.jsonify')
def test_join_project_route(mock_jsonify, mock_request):
    # Mocking the request.get_json() method
    mock_request.get_json.return_value = {
        'user_id': 123,
        'project_id': 456
    }

    # Testing the case where the join_project() function returns True
    with patch('project_routes.join_project') as mock_join_project:
        mock_join_project.return_value = True
        response = join_project_route()

    # Check if the appropriate response is returned
    mock_jsonify.assert_called_with({"message": "Successfully joined project"})
    assert response[1] == 200  # Check if the HTTP status code is 200

    # Testing the case where the join_project() function returns False
    with patch('project_routes.join_project') as mock_join_project:
        mock_join_project.return_value = False
        response = join_project_route()

    # Check if the appropriate response is returned
    mock_jsonify.assert_called_with({"message": "Failed to join project"})
    assert response[1] == 400  # Check if the HTTP status code is 400

    
# test_create_project.py

from unittest.mock import patch

from project_routes import create_project_route

# Mocking the necessary components for testing
@patch('project_routes.request')
@patch('project_routes.jsonify')
@patch('project_routes.supabase')  # Mocking the supabase interaction
def test_create_project_route(mock_supabase, mock_jsonify, mock_request):
    # Mocking the request.get_json() method
    mock_request.get_json.return_value = {
        "projectId": 123,
        "projectName": "Test Project"
    }

    # Mocking supabase.table().select().execute() to return an empty list initially
    mock_supabase.table().select().execute.return_value = {'data': []}

    # Testing the case where the project creation is successful
    with patch('project_routes.create_project') as mock_create_project:
        mock_create_project.return_value = {"project_id": 123, "project_name": "Test Project"}
        response = create_project_route()

    # Check if the appropriate response is returned for successful creation
    mock_jsonify.assert_called_with({"project_id": 123, "project_name": "Test Project"})
    assert response[1] == 201  # Check if the HTTP status code is 201

    # Testing the case where the project ID is already in use
    mock_supabase.table().select().execute.return_value = {'data': [{'project_id': 123}]}
    response = create_project_route()

    # Check if the appropriate response is returned for duplicate project ID
    mock_jsonify.assert_called_with({"Error Message": "ERROR WITH ID"})
    assert response[1] == 403  # Check if the HTTP status code is 403

    # Testing the case where the project name is already in use
    mock_supabase.table().select().execute.return_value = {'data': [{'project_name': "Test Project"}]}
    response = create_project_route()

    # Check if the appropriate response is returned for duplicate project name
    mock_jsonify.assert_called_with({"Error Message": "ERROR WITH NAME"})
    assert response[1] == 403  # Check if the HTTP status code is 403
    
    
from unittest.mock import patch, MagicMock

# Assuming signup function is imported from your module
from auth_routes import signup

# Mocking the necessary components for testing
@patch('auth_routes.request')
@patch('auth_routes.jsonify')
@patch('auth_routes.bcrypt')
@patch('auth_routes.supabase')  # Mocking the supabase interaction
def test_signup(mock_supabase, mock_bcrypt, mock_jsonify, mock_request):
    # Mocking the request.get_json() method
    mock_request.get_json.return_value = {
        "email": "test@example.com",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe"
    }

    # Mocking bcrypt hashing function
    mock_bcrypt.hashpw.return_value = b'hashed_password'

    # Mocking Supabase sign-up response
    mock_supabase_instance = MagicMock()
    mock_supabase_instance.auth.sign_up.return_value = {
        "data": {"user_id": "123"},
        "error": None
    }
    mock_supabase.return_value = mock_supabase_instance

    # Mocking Supabase table insert response
    mock_insert_response = {
        "error": None
    }
    mock_supabase_instance.table().insert().execute.return_value = mock_insert_response

    # Test the signup function
    response = signup()

    # Check if the appropriate response is returned for successful signup
    mock_jsonify.assert_called_with({"message": "Signup successful!", "user": {'user_id': '123'}})
    assert response[1] == 200  # Check if the HTTP status code is 200

