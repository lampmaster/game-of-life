/*
В зависимости от выбранной опции в консоли, программа может:
+ Сгенерировать случайную матрицу размером n x m 
+ Получить матрицу из файла 

Пример матрицы в файле:
0, 0, 0
1, 1, 1
0, 0, 0
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// генерирует новое состояние доски
function generateNextState(board) {
    let row = board.length, col = board[0].length
    
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            // считаем количество живых соседей для ячейки [i, j]
            const col = countNeighbors(board, i, j)
            
            // мертвая клетка, у которой три живых соседа, возрождается
            if (board[i][j] === 0 && col === 3) {
                board[i][j] = 2
            }
            
            // живая клетка, у которой меньше двух или больше трех соседей, умирает
            if (board[i][j] === 1 && (col > 3 || col < 2) ) {
                board[i][j] = -1
            }
        }
    }
    
    // окончательное представление доски
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {            
            if (board[i][j] > 0) {
                board[i][j] = 1
            } else {
                board[i][j] = 0
            }
        }
    }
};

// подсчет живых соседей
function countNeighbors(board, i, j) {
    const neighborsPositions = [[-1,-1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    let counter = 0
    
    neighborsPositions.forEach(pos => {
        const rowPos = i + pos[0], colPos = j + pos[1]
        
        if (board[rowPos] !== undefined 
            && board[rowPos][colPos] !== undefined) {
            
            if (board[rowPos][colPos] === 1 || board[rowPos][colPos] === -1) {
                counter++
            }
        }
    })
    
    return counter
}

// генерация случайной матрицы n x m
function generateBoard(n, m) {
    const board = Array(n).fill(0).map(_ => Array(m).fill(0)) 

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j] = Math.round(Math.random())
        }
    }

    return board
}

function printBoard(board) {
    board.forEach(el => console.log(JSON.stringify(el.map(el => el === 0 ? '.' : String(el)))) )
}

function startGame(board) {
    if (board.length === 0 || board[0].length === 0) {
        console.log('Неправильный размер матрицы')
        return
    }

    console.log('Начальная матрица')
    printBoard(board)

    let counter = 0

    setInterval(() => {
        generateNextState(board)
        console.clear()
        console.log(`${++counter} итерация`)
        printBoard(board)
    }, 1000)
}

function main() {    
    rl.question('Вы хотите сгенерировать случайную матрицу? (y/n): ', (answer) => {
        if (answer.toLowerCase().trim() === 'y') {
            rl.question('Введите размер доски. (Например: 3 3): ', (answer) => {
                const [n = 0, m = 0] = answer.trim().split(' ').map(Number)
                const board = generateBoard(n, m)
                startGame(board)
                rl.close()
            })
        } else if (answer.toLowerCase().trim() === 'n') {
            rl.question('Введите путь к файлу. (Например: С://Desktop/myfile.txt): ', (answer) => {
                const fs = require('fs');
                
                try {
                    const arrStr = fs.readFileSync(answer, 'utf8')
                    const board = arrStr.split("\r\n").map(el => el.split(",").map(Number))
                    startGame(board)
                    rl.close()
                } catch (err) {
                    throw new Error(err)
                }
            })
        } else {
            rl.close()
        }
    });
}

main()
