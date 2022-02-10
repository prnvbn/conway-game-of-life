import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import produce from "immer";

const numRows = 50
const numCols = 100


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
  const [grid, setGrid] = useState(() => {
    const grid = [];

    for (let i = 0; i < numRows; i++) {
      grid.push(new Array(numCols).fill(0));
    }

    return grid
  })


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
        key={`${i}-${j}`}
        style={{
          width: 20,
          height: 20,
          backgroundColor: grid[i][j] ? '#6ee7b7' : undefined,
          border: 'solid 1px black'
        }}
        onClick={updateCell(i, j)} />;
    }
    ));
  }


  const runningRef = useRef(running);
  runningRef.current = running;

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

          // return gridCopy;
        });
      })

      setTimeout(runSimulation, 1_000);
    }, []
  )


  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation()
          }
        }}>
        {running ? 'stop' : 'start'}
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
        {
          mapGrid()
        }
      </div>
    </>
  );




}

export default App;
