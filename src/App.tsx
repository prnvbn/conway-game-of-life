import React, { useState } from 'react';
import './App.css';
import produce from "immer";

const numRows = 50
const numCols = 100

function App() {
  const [grid, setGrid] = useState(() => {
    const grid = [];

    for (let i = 0; i < numRows; i++) {
      grid.push(new Array(numCols).fill(0));
    }

    return grid
  })


  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
      {
        grid.map((rows, i) =>
          rows.map((col, j) => {
            return <div
              key={`${i}-${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? '#6ee7b7' : undefined,
                border: 'solid 1px black'
              }}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = !grid[i][j];
                  return gridCopy
                })
                setGrid(newGrid)
              }}
            />
          }
          ))
      }
    </div >
  );
}

export default App;
