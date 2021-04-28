import React from "react"
import { useHistory } from "react-router-dom";
import { Nav, Button, Modal, Alert } from "react-bootstrap";
import { AuthContext } from "../../../App";

const initialState = {
  show: false,
  isDeleting: false,
  hasError: false,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "DELETE_COMMENT_REQUEST": {
      return {
        ...state,
        isDeleting: true,
        hasError: false,
      };
    }
    case "DELETE_COMMENT_SUCCESS": {
      return {
        ...state,
        isDeleting: false,
        show: false,
      };
    }
    case "DELETE_COMMENT_FAILURE": {
      return {
        ...state,
        isDeleting: false,
        hasError: true,
      };
    }
    case "SET_SHOW": {
      return {
        ...state,
        show: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
const DeleteCommentModal = (props) => {
  const article = props.article;
  const comment = props.comment;
  const onCommentDeleted = props.onCommentDeleted;
  const authContext = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const setShow = (show) => {
    dispatch({
      type: "SET_SHOW",
      payload: show,
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = () => {
    dispatch({
      type: "DELETE_COMMENT_REQUEST",
    });
    fetch(
      `http://localhost:8000/articles/${article._id}/comments/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${authContext.state.token}`,
        },
      }
    ).then((res) => {
    onCommentDeleted(comment);
    dispatch({
      type: "DELETE_COMMENT_SUCCESS",
    });
    })

    .catch((error) => {
      dispatch({
        type: "DELETE_COMMENT_FAILURE",
      });
    });
    setShow(false);
  };
  return (
    <>
      <Button
        className="m-1"
        variant="light"
        type="button"
        onClick={handleShow}
      >
        Delete
      </Button>
      <Modal
        show={state.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state.errorMessage && (
            <Alert variant="danger">{state.errorMessage}</Alert>
          )}
          <p>Are you sure you want to delete this comment ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleConfirm}
            disabled={state.isDeleting}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCommentModal;