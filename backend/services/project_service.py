from flask import Blueprint, request, jsonify
from supabase import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

def create_project(name, id):
    data = {"project_id": id, "project_name": name}
    response = supabase.table("Projects").insert(data).execute()
    print("Supabase Response:", response)
    return response.data[0]

def get_projects_with_ids(user_id):
    try:
        logging.info("Attempting to fetch projects with IDs from Supabase")
        response = supabase.table("Users").select("Projects").eq("UserID", str(user_id)).execute()
        ids = list(response.data[0]["Projects"].keys())
        ids = [int(x) for x in ids]
        response = supabase.table("Projects").select("*").in_("project_id", ids).execute()
        data = response.data
        logging.info("Fetched projects successfully: {}".format(data))
        return {"data": data, "error": None}
    except Exception as e:
        logging.error(f"Exception in get_projects_with_ids: {e}")
        return {"data": [], "error": str(e)}

def join_project(user_id, project_id):
    try:
        # Check if the project exists
        project_response = supabase.table("Projects").select("*").eq("project_id", str(project_id)).execute()
        if not project_response.data:
            # If the project does not exist, return a message
            return {"success": False, "message": "Project does not exist"}

        # If the project exists, proceed to join the user to the project
        user_response = supabase.table("Users").select("Projects").eq("UserID", str(user_id)).execute()
        if user_response.data:
            entry = user_response.data[0]
            entry["Projects"][str(project_id)] = 0
            supabase.table("Users").update(entry).eq("UserID", str(user_id)).execute()
            return {"success": True, "message": "Joined project successfully"}
        else:
            return {"success": False, "message": "User not found"}

    except Exception as e:
        logging.error(f"Exception in join_project: {e}")
        return {"success": False, "message": "Failed to join project with error " + str(e)}

        
