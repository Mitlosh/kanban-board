import "../App.css";
import React, { useState, useEffect } from "react";
import { getRepos } from "../actions/repos";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import IssueCard from "./IssueCard";

interface Column {
  name: string;
  items: any[];
}

const columnsFromBackend = {
  [crypto.randomUUID().toString()]: {
    name: "To do",
    items: [],
  },
  [crypto.randomUUID().toString()]: {
    name: "In Progress",
    items: [],
  },
  [crypto.randomUUID().toString()]: {
    name: "Done",
    items: [],
  },
};

const Main = () => {
  const [columns, setColumns] = useLocalStorage<{ [key: string]: Column }>("issues", columnsFromBackend);
  const [searchValue, setSearchValue] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const dispatch: any = useDispatch();
  const issuesArr: any[] = useSelector((state: any) => state.repos.issues);
  const loading: boolean = useSelector((state: any) => state.repos.loading);

  const openedIssues: any[] = issuesArr?.filter((issue: any) => issue.state === "open");
  const closedIssues: any[] = issuesArr?.filter((issue: any) => issue.state === "closed");
  const inProgressIssues: any[] = issuesArr?.filter((issue: any) => issue.assignees.length > 0);

  const updateColumns = () => {
    if (Array.isArray(issuesArr)) {
      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };

        updatedColumns[Object.keys(prevColumns)[0]].items = openedIssues;
        updatedColumns[Object.keys(prevColumns)[1]].items = inProgressIssues;
        updatedColumns[Object.keys(prevColumns)[2]].items = closedIssues;
        console.log("Updated Columns: ", updatedColumns);

        return updatedColumns;
      });
    }
  };

  useEffect(() => {
    updateColumns();
  }, [issuesArr]);

  const searchRepoHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateColumns();
    if (searchValue === "") return;
    const [owner, repo] = searchValue.split("/").slice(-2);
    setOwner(owner);
    setRepo(repo);
    dispatch(getRepos(owner, repo));
  };

  /*================================= Drag and Drop logic ===================================== */
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <>
      <Container>
        <div>
          <h1 className="text-center my-3">Github Kanban Board</h1>
          <Form className="d-flex align-items-start gap-3 my-3">
            <Form.Group style={{ width: "80%" }} controlId="formBasicEmail">
              <Form.Control
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                type="text"
                placeholder="Enter repository URL"
              />
              <Form.Text className="text-muted">Example: https://github.com/facebook/react</Form.Text>
            </Form.Group>
            <Button style={{ width: "20%" }} variant="primary" type="submit" onClick={(e) => searchRepoHandler(e)}>
              Search
            </Button>
          </Form>
          {owner && repo && (
            <div style={{ color: "blue" }}>
              <a href={searchValue.split("/").slice(0, -1).join("/")} target="_blank" rel="noreferrer">
                {owner}
              </a>
              {">"}
              <a href={searchValue} target="_blank" rel="noreferrer">
                {repo}
              </a>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center gap-5">
          <DragDropContext onDragEnd={(result: any) => onDragEnd(result)}>
            {loading ? (
              <h4>Loading</h4>
            ) : (
              Object.entries(columns)?.map(([id, column]) => (
                <div className="text-center" key={id}>
                  <h2 className="my-3">{column.name}</h2>
                  <Droppable droppableId={id}>
                    {(provided: any, snapshot: any) => (
                      <Row
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid lightgrey",
                          background: snapshot.isDraggingOver ? "lightblue" : "#f1f1f1",
                          padding: "12px 0",
                          width: 320,
                          minHeight: 500,
                        }}>
                        <Col>
                          {column.items?.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                              {(provided: any, snapshot: any) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    borderRadius: "8px",
                                    backgroundColor: snapshot.isDragging ? "#6caad6" : "#fff",
                                    ...provided.draggableProps.style,
                                  }}>
                                  <IssueCard issue={item} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Col>
                      </Row>
                    )}
                  </Droppable>
                </div>
              ))
            )}
          </DragDropContext>
        </div>
      </Container>
    </>
  );
};

export default Main;
