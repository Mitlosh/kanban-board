import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "../App.css";
import { getRepos } from "../actions/repos";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface Column {
  name: string;
  items: any[];
}

const itemsFromBackend = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
];

const Main = () => {
  const issuesArr: any[] = useSelector((state: any) => state.repos.issues);

  const [searchValue, setSearchValue] = useState("");
  const dispatch: any = useDispatch();
  const loading: boolean = useSelector((state: any) => state.repos.loading);

  const openedIssues: any[] = issuesArr?.filter((issue: any) => issue.state === "open");
  const closedIssues: any[] = issuesArr?.filter((issue: any) => issue.state === "closed");
  const inProgressIssues: any[] = issuesArr?.filter((issue: any) => issue.assignees.length > 0);

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
  const [columns, setColumns] = useState<{ [key: string]: Column }>(columnsFromBackend);

  useEffect(() => {
    dispatch(getRepos("facebook/react"));
    console.log("Issues: ", issuesArr);
    console.log("Columns: ", columns.name);
  }, []);

  const searchRepoHandler = () => {
    console.log("Issues: ", issuesArr);
    console.log("Columns: ", columns);

    if (Array.isArray(issuesArr)) {
      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };

        updatedColumns[Object.keys(prevColumns)[0]].items = openedIssues;
        updatedColumns[Object.keys(prevColumns)[1]].items = inProgressIssues;
        updatedColumns[Object.keys(prevColumns)[2]].items = closedIssues;

        return updatedColumns;
      });
    }

    // dispatch(getRepos(searchValue));
  };

  /*================================================================================= */

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
          <h1>Github Kanban Board</h1>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="text"
            placeholder="Enter repository URL"
          />
          <button onClick={() => searchRepoHandler()}>Search</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {Object.entries(columns)?.map(([id, column]) => (
              <div key={id}>
                <h2>{column.name}</h2>
                <Droppable droppableId={id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                        padding: 4,
                        width: 250,
                        minHeight: 500,
                      }}>
                      {column.items?.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                minHeight: "50px",
                                backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                                color: "white",
                                ...provided.draggableProps.style,
                              }}>
                              {item.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </Container>
    </>
  );
};

export default Main;
