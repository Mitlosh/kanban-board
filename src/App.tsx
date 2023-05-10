import React, { useState } from "react";
import "./App.css";

interface Board {
  id: number;
  title: string;
  cards: Card[];
}

interface Card {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: "To Do",
      cards: [
        { id: 1, title: "London", description: "This is the London" },
        { id: 2, title: "Kyiv", description: "This is the Kyiv" },
        { id: 3, title: "Lutsk", description: "This is the Lutsk" },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        { id: 4, title: "Paris", description: "This is the Paris" },
        { id: 5, title: "Milan", description: "This is the Milan" },
        { id: 6, title: "Lviv", description: "This is the Lviv" },
      ],
    },
    {
      id: 3,
      title: "Done",
      cards: [
        { id: 7, title: "Warsaw", description: "This is the Warsaw" },
        { id: 8, title: "Istanbul", description: "This is the Istanbul" },
        { id: 9, title: "Tokyo", description: "This is the Tokyo" },
      ],
    },
  ]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();

    if (e.target.className == "card") {
      e.target.style.boxShadow = "0 2px 3px lightgray";
    }
  }

  function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>): void {
    e.target.style.boxShadow = "none";
  }

  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, board: Board, card: Card): void {
    setCurrentBoard(board);
    setCurrentCard(card);

    e.target.style.opacity = "0.01";
  }

  function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
    e.target.style.boxShadow = "none";
    e.target.style.opacity = "1";
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.target.style.boxShadow = "none";
  }

  function dropCardHandler(e: React.DragEvent<HTMLDivElement>, board: Board): void {
    if (!currentBoard || !currentCard || board === currentBoard) {
      return;
    }
    e.currentTarget.classList.add("dropped");
    // Create new copies of the cards arrays for the modified boards
    const newBoardCards = [...board.cards, currentCard];
    const newCurrentBoardCards = currentBoard.cards.filter((card) => card !== currentCard);

    // Create new copies of the board objects with the updated cards arrays
    const newBoard = { ...board, cards: newBoardCards };
    const newCurrentBoard = { ...currentBoard, cards: newCurrentBoardCards };

    // Create a new array of boards with the updated board objects
    const newBoards = boards.map((b) => {
      if (b.id === board.id) {
        return newBoard;
      }
      if (b.id === currentBoard.id) {
        return newCurrentBoard;
      }
      return b;
    });

    // Update the state with the new array of boards
    setBoards(newBoards);
  }

  return (
    <>
      <h1>Github Kanban Board</h1>
      <div className="app">
        {boards.map((board) => (
          <div
            onDrop={(e) => dropCardHandler(e, board)}
            // onDragLeave={(e) => dragLeaveHandler(e)}
            className="board"
            key={board.id}>
            <h2 className="board__title">{board.title}</h2>
            {board.cards.map((card) => (
              <div
                onDragStart={(e) => dragStartHandler(e, board, card)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                // onDragEnter={(e) => dragEnterHandler(e)}
                onDrop={(e) => dropHandler(e)}
                draggable={true}
                className="card"
                key={card.id}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
