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

def get_projects_with_ids():
    try:
        logging.info("Attempting to fetch projects with IDs from Supabase")
        response = supabase.table("Projects").select("project_id, project_name").execute()
        data = response.data
        logging.info("Fetched projects successfully: {}".format(data))
        return {"data": data, "error": None}
    except Exception as e:
        logging.error(f"Exception in get_projects_with_ids: {e}")
        return {"data": [], "error": str(e)}

def join_project(user_id, project_id):
    try:
        response = supabase.table("Users").select("Projects").eq("UserID", str(user_id)).execute()
        entry = response.data[0]
        entry["Projects"][str(project_id)] = 0
        supabase.table("Users").update(entry).eq("UserID", str(user_id)).execute()
        return {"success": True, "message": "Joined project successfully"}
    except Exception as e:
        logging.error(f"Exception in join_project: {e}")
        return {"success": False, "message": "Failed to join project with error" + str(e)}
        
