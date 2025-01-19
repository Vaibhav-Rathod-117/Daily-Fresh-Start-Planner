from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Store tasks as a list of dictionaries
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        task_data = request.json
        tasks.append({"id": len(tasks) + 1, "text": task_data["text"], "important": False})
        return jsonify({"message": "Task added", "tasks": tasks})
    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def modify_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            if request.method == 'PUT':
                task["text"] = request.json.get("text", task["text"])
                task["important"] = request.json.get("important", task["important"])
                return jsonify({"message": "Task updated", "task": task})
            elif request.method == 'DELETE':
                tasks.remove(task)
                return jsonify({"message": "Task deleted", "tasks": tasks})
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
