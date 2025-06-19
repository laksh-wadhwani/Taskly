import React, { useEffect, useRef, useState } from "react";
import "./specificTask.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import editButton from "../assets/edit.svg";
import deleteTask from "../assets/deleteTask.svg";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendURL } from "../BackendContext";

const SpecificTask = ({ user }) => {
  const API = BackendURL();
  const navigate = useNavigate();
  const toastId = useRef(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const location = useLocation();
  const [taskDetails, setTaskDetails] = useState(
    location.state?.taskDetails || {}
  );
  const [updateTask, setTask] = useState({
    name: "",
    duration: Date.now(),
    description: "",
  });
  const [attachment, setAttachment] = useState();
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState([]);
  const [status, setStatus] = useState(taskDetails.status);

  useEffect(() => {
    axios
      .get(`${API}/User/GetTaskDetails/${taskDetails._id}`)
      .then((response) => setUpdatedTaskDetails(response.data))
      .catch((error) =>
        console.error("Error in fetching task details: " + error)
      );
  }, [updatedTaskDetails]);

  const handleChange = (eventTriggered) => {
    const { name, value } = eventTriggered.target;
    setTask({
      ...updateTask,
      [name]: value,
    });
  };

  const fetchUpdatedTask = () => {
    axios
      .get(`${API}/User/GetSingleTask/${taskDetails._id}`)
      .then((res) => {
        setTaskDetails(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => console.error("Error fetching updated task:", err));
  };

  const UpdateStatus = (taskId) => {
    const TaskAttachment = new FormData();
    Object.entries(updateTask).forEach(([key, value]) => {
      TaskAttachment.append(key, value);
    });
    TaskAttachment.append("Attachment", attachment);

    toastId.current = toast.loading("Please Wait...");
    axios
      .post(
        `${API}/User/UpdateTaskStatus/${taskId}/${user._id}`,
        TaskAttachment
      )
      .then((response) => {
        if (response.data.message === "Task has been updated successfully") {
          toast.update(toastId.current, {
            render: response.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2500,
          });
          fetchUpdatedTask();
          setOpen1(false);
          return;
        }
        toast.update(toastId.current, {
          render: response.data.message,
          type: "error",
          isLoading: false,
        });
      });
  };

  const CompleteTask = (taskId) => {
    toastId.current = toast.loading("Please Wait...");
    axios.put(`${API}/User/CompleteTask/${taskId}`).then((response) => {
      if (response.data.message === "Task has complted successfully") {
        toast.update(toastId.current, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 2500,
        });
        fetchUpdatedTask();
        setOpen1(false);
        return;
      }
      toast.update(toastId.current, {
        render: response.data.message,
        type: "error",
        isLoading: false,
      });
    });
  };

  const TaskDelete = (taskID) => {
    axios
      .delete(`${API}/User/DeleteTask/${taskID}`)
      .then((response) => {
        if (response.data.message) {
          toast.success(response.data.message, { autoClose: 2500 });
          setTimeout(() => {
            navigate("/Tasks");
          }, 2500);
          return;
        }
        toast.error(response.data.message);
      })
      .catch((error) => {
        toast.error(error?.response?.data.message || "Soemthing went wrong...");
        console.error("getting error in deleting task: ", error);
      });
  };

  const TaskEdit = (taskId) => {
    axios
      .put(`${API}/User/EditTask/${taskId}`, updateTask)
      .then((response) => {
        if (response.data.message === "Task details has updated successfully") {
          toast.success(response.data.message, { autoClose: 2500 });
          setTimeout(() => {
            navigate(0);
          }, 2500);
          return;
        }
        toast.error(response.data.message);
      })
      .catch((error) => {
        toast.error(error?.response?.data.message || "Soemthing went wrong...");
        console.error("getting error in editing task details: ", error);
      });
  };

  const getStatusButtonProps = (status) => {
    switch (status) {
      case "To Do":
        return {
          text: "Work on it now",
          className: "status-btn-pending",
          nextStatus: "In Progress",
        };
      case "In Progress":
        return {
          text: "Mark as completed",
          className: "status-btn-inprogress",
          nextStatus: "Done",
        };
      case "Done":
        return {
          text: "Task completed",
          className: "status-btn-completed",
          disabled: true,
        };
      default:
        return {
          text: "Update Status",
          className: "status-btn-default",
        };
    }
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="task-form">
          <span>Edit Task</span>
          <div>
            <label>Task name</label>
            <input
              name="name"
              value={updateTask.name}
              type="text"
              placeholder={taskDetails.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              name="duration"
              value={updateTask.duration}
              type="date"
              placeholder={taskDetails.duration}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Task Description</label>
            <textarea
              name="description"
              value={updateTask.description}
              type="text"
              placeholder={taskDetails.description}
              onChange={handleChange}
            />
          </div>
          <button
            className="task-create-btn"
            onClick={() => TaskEdit(taskDetails._id)}
          >
            Edit Task
          </button>
        </div>
      </Modal>

      <div className="main-boxx">
        <div className="upper-bar">
          <div>
            <h5>Tasks</h5>
            <span>{taskDetails.name}</span>
          </div>
        </div>
        {console.log(taskDetails)}
        <div className="task-view-list">
          <div className="edit-task">
            <div className="users-shareAdmin">
              <label>Admin: </label>
              <div>
                <img
                  src={taskDetails.admin_userid.profile}
                  alt="User Profile"
                />
              </div>
            </div>
            <div className="users-shareAdmin">
              <label>Shared with: </label>
              <div>
                {taskDetails?.shared_users.map((user) => (
                  <img src={user.userID.profile} alt="User Profile" />
                ))}
              </div>
            </div>
          </div>

          <div className="edit-task">
            <div className="task-details">
              <div>
                <p>{taskDetails.name}</p>
                <p data-status={taskDetails.status}>{taskDetails.status}</p>
              </div>
              <p>{taskDetails.description}</p>
              <p>{taskDetails.duration}</p>
              <div>
                <button
                  className={`task-status-btn ${
                    getStatusButtonProps(taskDetails.status).className
                  }`}
                  onClick={() => setOpen1(true)}
                  disabled={status === "Done"}
                >
                  {getStatusButtonProps(taskDetails.status).text}
                </button>
                <button
                  className="action-buttons"
                  onClick={() => TaskDelete(taskDetails._id)}
                  disabled={status === "Done"}
                >
                  <img src={deleteTask} alt="Delete Button" />
                </button>
                <button
                  className="action-buttons"
                  onClick={() => setOpen(true)}
                  disabled={status === "Done"}
                >
                  <img src={editButton} alt="Edit Button" />
                </button>
              </div>
            </div>
          </div>

          {updatedTaskDetails.map((details) => (
            <div className="edit-task">
              <div className="task-details">
                <div>
                  <p>Commited by {details.userId.fullname}</p>
                </div>
                <p>{details.task_description}</p>
                <p>Date: {details.date}</p>
                {details.attachment && (
                  <div>
                    <button
                      className="task-create-btn"
                      onClick={() => window.open(details.attachment, "_blank")}
                    >
                      Attachment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={open1} onClose={() => setOpen1(false)} center>
        <div className="task-form">
          <span>Update Task</span>
          <div>
            <label>Description</label>
            <textarea
              placeholder="Brief description about what you've done"
              name="description"
              value={updateTask.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Attachment if needed</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </div>

          <div style={{ flexDirection: "row" }}>
            <button
              className="task-create-btn"
              onClick={() => UpdateStatus(taskDetails._id)}
              disabled={status === "Done"}
            >
              Update Status
            </button>

            {status === "In Progress" && (
              <button
                className={`task-status-btn ${
                  getStatusButtonProps(taskDetails.status).className
                }`}
                disabled={status === "Done"}
                onClick={() => CompleteTask(taskDetails._id)}
              >
                {getStatusButtonProps(taskDetails.status).text}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default SpecificTask;
