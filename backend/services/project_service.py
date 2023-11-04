from flask import Blueprint, request, jsonify
from supabase_py import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

def create_project(name):
    data = {"project_name": name}
    project_response, error = supabase.table("Projects").insert(data).execute()
    
    print("Supabase Response:", project_response)
    print("Supabase Error:", error)

    if error:
        logging.error(f"Error creating project: {error}")
        return None
    
    if 'data' not in project_response or not project_response['data']:
        logging.error(f"Unexpected response from Supabase: {project_response}")
        return None
    
    return project_response['data'][0]


def get_projects():
    data, error = supabase.table("Projects").select("project_name").execute()

    # Extract the project names into a list of strings
    project_names = [project['project_name'] for project in data.data]
    
    if error:
        logging.error(f"Error fetching projects: {error}")
        return []
    
    print(data)
    print(project_names)
    
    return project_names
