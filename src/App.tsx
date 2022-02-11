import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import produce from "immer";

const numRows = 20
const numCols = 20

const neighbourOperations = [
  [-1, 0],  //N
  [1, -1],  //NE
  [1, 0],   //E
  [1, 1],   //SE
  [0, 1],   //S
  [-1, 1],  //SW
  [0, -1],  //W
  [-1, -1], //NW
]

function App() {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(generateEmptyGrid())

  const runningRef = useRef(running);
  runningRef.current = running;

  const timeStep = 10;
  const runSimulation = useCallback(
    () => {

      if (!runningRef.current) {
        return;
      }

      // SIMULATION
      setGrid((g) => {
        return produce(g, gridCopy => {
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              let numNeighbours = 0;

              // Counting the no. of neighbours
              neighbourOperations.forEach(([x, y]) => {
                const newI = i + x;
                const newJ = j + y;

                // checking if all indeces are in bounds
                if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                  numNeighbours += g[newI][newJ];
                }
              })

              // RULES 
              // Any live cell with two or three live neighbours lives on to the next generation.

              // CELL DEATH
              // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
              // Any live cell with more than three live neighbours dies, as if by overpopulation.
              if (numNeighbours < 2 || numNeighbours > 3) {
                gridCopy[i][j] = 0;
              }

              // CELL BIRTH
              // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
              else if (g[i][j] === 0 && numNeighbours === 3) {
                gridCopy[i][j] = 1;
              }
            }
          }
        });
      })
      setTimeout(runSimulation, timeStep);
    }, []
  )


  return (
    <>
      <div className='grid grid-cols-3 p-5 justify-items-center'>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation()
            }
          }}>
          {running ? 'stop' : 'start'}
        </button>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setGrid(generateEmptyGrid())}>
          clear
        </button>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setGrid(generateRandomGrid())}>
          random
        </button>
      </div>

      <div className="grid grid-cols-map center place-content-center">
        {mapGrid()}
      </div>

    </>
  );

  function generateEmptyGrid() {
    const emptyGrid = [];
    for (let i = 0; i < numRows; i++) {
      emptyGrid.push(
        new Array(numCols).fill(0)
      );
    }

    return emptyGrid;
  }

  function generateRandomGrid() {
    const emptyGrid = [];
    for (let i = 0; i < numRows; i++) {
      emptyGrid.push(
        Array.from(Array(numCols), () => Math.random() > 0.69 ? 1 : 0)
      );
    }

    return emptyGrid;
  }

  function updateCell(i: number, j: number): React.MouseEventHandler<HTMLDivElement> | undefined {
    return () => {
      const newGrid = produce(grid, gridCopy => {
        gridCopy[i][j] = !grid[i][j];
        return gridCopy;
      });
      setGrid(newGrid);
    };
  }

  function mapGrid(): React.ReactNode {
    return grid.map((rows, i) => rows.map((col, j) => {
      return <div
        className='border-solid border-black border'
        key={`${i}-${j}`}
        style={{
          width: 20,
          height: 20,
          backgroundColor: grid[i][j] ? '#6ee7b7' : 'white',
        }}
        onClick={updateCell(i, j)} />;
    }
    ));
  }


}

export default App;
