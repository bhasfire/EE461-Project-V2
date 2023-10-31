from flask import Blueprint, request, jsonify
from services.project_service import create_project, get_projects

project_bp = Blueprint('project', __name__)

@project_bp.route("/create", methods=["POST"])
def create_project_route():
    data = request.get_json()
    project_name = data.get("name")
    if not project_name:
        return jsonify({"message": "Project name is required"}), 400
    project = create_project(project_name)
    return jsonify(project), 201

@project_bp.route("/", methods=["GET"])
def get_projects_route():
    projects = get_projects()
    return jsonify(projects), 200
