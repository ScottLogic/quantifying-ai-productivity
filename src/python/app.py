from flask import Flask, jsonify, request
import uuid
from datetime import datetime
import pytz

app = Flask(__name__)

# Sample data
data = [
    {
        "uuid": "f360ba09-4682-448b-b32f-0a9e538502fa",
        "name": "Walk the dog",
        "description": "Walk the dog for forty-five minutes",
        "created": "2023-06-23T09:30:00Z",
        "completed": None,
        "complete": False
    },
    {
        "uuid": "fd5ff9df-f194-4c6e-966a-71b38f95e14f",
        "name": "Mow the lawn",
        "description": "Mow the lawn in the back garden",
        "created": "2023-06-23T09:00:00Z",
        "completed": None,
        "complete": False
    },
    {
        "uuid": "5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
        "name": "Test generative AI",
        "description": "Use generative AI technology to write a simple web service",
        "created": "2023-06-23T09:00:00Z",
        "completed": None,
        "complete": False
    }
]

unknown_task = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": None,
    "complete": False
}

# Get the local time zone
local_timezone = pytz.timezone('Europe/London')

# Define a route to get items with an optional 'complete' parameter
@app.route('/todo', methods=['GET'])
def get_items():
    complete_param = request.args.get('complete', default=None)

    if complete_param is not None:
        complete_param = complete_param.lower()  # Convert to lowercase
        if complete_param == 'true':
            filtered_items = [item for item in data if item["complete"]]
        elif complete_param == 'false':
            filtered_items = [item for item in data if not item["complete"]]
        else:
            return jsonify({"message": "Invalid 'complete' parameter value. Use 'true' or 'false'."}), 400
    else:
        filtered_items = data

    return jsonify(filtered_items)

# Define a route to get an item by UUID
@app.route('/todo/<uuid>', methods=['GET'])
def get_item_by_uuid(uuid):
    if not is_valid_uuid(uuid):
        return jsonify({"message": "Invalid UUID format"}), 400

    item = next((item for item in data if item["uuid"] == uuid), None)
    if item:
        return jsonify(item)
    else:
        return unknown_task


# Define a route to mark an item as complete
@app.route('/todo/completed/<uuid>', methods=['PUT'])
def mark_item_complete(uuid):
    if not is_valid_uuid(uuid):
        return jsonify({"success": False, "message": "Invalid UUID format"}), 400

    item = next((item for item in data if item["uuid"] == uuid), None)
    if item:
        if not item["complete"]:
            item["complete"] = True
            item["completed"] = datetime.now(local_timezone).isoformat()
            return jsonify({"success": True, "message": "This task has now been completed."}), 200
        else:
            return jsonify({"success": False, "message": "Task already marked complete."}), 200
    else:
        return jsonify({"success": False, "message": "Task not found."}), 200


# Define a route to create a new task with parameters
@app.route('/todo/addTask', methods=['POST'])
def create_task():
    try:
        task_name = request.args.get('name')
        task_description = request.args.get('description')

        if not task_name or not task_description:
            return jsonify({"message": "Name and description parameters are required"}), 400

        new_task = {
            "uuid": generate_uuid(),
            "name": task_name,
            "description": task_description,
            "created": datetime.now(local_timezone).isoformat(),
            "completed": None,
            "complete": False
        }

        data.append(new_task)

        return jsonify({"taskId": new_task["uuid"], "message": f"Task {task_name} added successfully."}), 201
    except Exception:
        return jsonify({"message": "An error occurred while creating the task"}), 500



# Function to check if a string is a valid UUID
def is_valid_uuid(uuid_string):
    try:
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False
    
# Function to generate a random UUID
def generate_uuid():
    return str(uuid.uuid4())

    
if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
