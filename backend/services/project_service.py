from flask import Blueprint, request, jsonify
from supabase_py import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

def create_project(name, id):
    data = {"project_id": id, "project_name": name}
    project_response, error = supabase.table("Projects").insert(data).execute()

    print("Supabase Response:", project_response)
    print("Supabase Error:", error)

    # Check if 'error' is a string, and if so, log it and return None
    if isinstance(error, str):
        logging.error(f"Error creating project: {error}")
        return None

    # If 'error' is a dictionary, check for a 'status_code' key
    if isinstance(error, dict) and 'status_code' in error and error['status_code'] != 201:
        logging.error(f"Error creating project: {error}")
        return None

    if 'data' not in project_response or not project_response['data']:
        logging.error(f"Unexpected response from Supabase: {project_response}")
        return None

    return project_response['data'][0]


def get_projects():
    data, error = supabase.table("Projects").select("project_id, project_name").execute()

    # Extract the project names into a list of strings
    project_names = [project['project_name'] for project in data.data]

    if error:
        logging.error(f"Error fetching projects: {error}")
        return []

    print(data)
    
    return data.data

def get_projects_with_ids():
    try:
        logging.info("Attempting to fetch projects with IDs from Supabase")
        response = supabase.table("Projects").select("project_id, project_name").execute()
        data = response.get('data')
        error = response.get('error')

        if error:
            logging.error(f"Supabase error: {error}")
            logging.error(f"Full Supabase response: {response}")
            return {"data": [], "error": str(error)}

        logging.info("Fetched projects successfully: {}".format(data))
        return {"data": data, "error": None}

    except Exception as e:
        logging.error(f"Exception in get_projects_with_ids: {e}")
        return {"data": [], "error": str(e)}



def join_project(user_id, project_id):
    membership_data = {
        "project_id": project_id,
        "user_id": user_id
    }
    membership_response, error = supabase.table("ProjectMembers").insert(membership_data).execute()

    if error:
        logging.error(f"Error joining project: {error}")
        return {"success": False, "message": str(error)}

    return {"success": True, "message": "Joined project successfully"}


