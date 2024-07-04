document.addEventListener('DOMContentLoaded', () => {
const stageElement = document.querySelector('.stage');
const scoreElement = document.querySelector('.score');
const stageSize = 20;
const tileSize = 18;
const directions = {
    ArrowUp:{x:0 , y:-1},
    ArrowDown:{x:0 , y:1},
    ArrowLeft:{x:-1 , y:0},
    ArrowRight:{x:1 , y:0}
};
const rowCount = 16;
const columnCount = 28;
var timeInterval = 300;

let snake = [{x:10 , y:10},
    {x:9 , y:10},
    {x:8 , y:10}
];
let startDirection = directions.ArrowRight;
let food = {x:15 , y:15};
let score = 0;
let gameInterval;





const createStage = () => {
    for ( i=0; i<rowCount; i++){
        const row = document.createElement('div');
        row.classList.add('row');
        for(j = 0; j<columnCount; j++){
            const tile = document.createElement('div');
            tile.classList.add('tile');

            row.appendChild(tile);
        }
    stageElement.appendChild(row);
    }
};



const drawSnake = () => {
    deleteSnake();
    if(stageElement){
        const rows = document.getElementsByClassName('row');
        snake.forEach((segment , index) => {
            const {x,y} = segment;
            if(y<rows.length && x<rows[y].children.length){
                const tile = rows[y].children[x];
                const tileBriteness = 255 - (index * 10);
                tile.classList.add('snake');
                tile.classList.remove('tile');
                if(index <= 17){
                    tile.style.backgroundColor = 'rgb(' + tileBriteness + ',' + tileBriteness + ',' + tileBriteness + ')';
                    tile.style.boxShadow = '0 0 5px 2px' + ' rgb(' + tileBriteness + ',' + tileBriteness + ',' + tileBriteness + ')';
                }
                else{
                    tile.style.backgroundColor = 'rgb(85,85,85)';
                    tile.style.boxShadow = '0 0 5px 2px' + ' rgb(85,85,85)';
                }
            }
        });

    }

}

const deleteSnake = () => {
    document.querySelectorAll('.snake').forEach(
        tile => {
            tile.classList.remove('snake');
            tile.classList.add('tile');
            tile.style.backgroundColor = 'rgba(0,0,0,0.15)';
            tile.style.boxShadow = 'none';
        }
    )
}

const drawFood = () => {
    const rows = document.getElementsByClassName('row');
    if(food.y<rows.length && food.x<rows[food.y].children.length){
        rows[food.y].children[food.x].classList.add('food');
        rows[food.y].children[food.x].classList.remove('tile');
        rows[food.y].children[food.x].style.backgroundColor = 'rgb(230, 126, 126)';
    }
};

const placeFood = () => {
    let newFoodPosition;
    flag = false;
    do{
        newFoodPosition = {x:Math.floor(Math.random()*columnCount), y:Math.floor(Math.random()*rowCount)};
    } while(!checkPlace(newFoodPosition));
    food = newFoodPosition;
    drawFood();
}

const deleteFood = () => {
    const rows = document.getElementsByClassName('row');
    if(food.y<rows.length && food.x<rows[food.y].children.length){
        rows[food.y].children[food.x].classList.add('tile');
        rows[food.y].children[food.x].classList.remove('food');
    }
}

function checkPlace(object){
    for(i = 0; i<snake.length; i++){
        if(snake[i].x === object.x && snake[i].y === object.y){
            return false;
        }
    }
    return true;
}


const moveSnake = () => {
    const head = {x:snake[0].x + startDirection.x, y:snake[0].y + startDirection.y};
    if(head.x<0 || head.y<0 || head.x>= columnCount || head.y>= rowCount
        || snake.some(segment => segment.x === head.x && segment.y === head.y)
    ){
        clearInterval(gameInterval);
        alert("Вы проиграли");
        location.reload();
        return;
    }
    snake.unshift(head);
    if(head.x === food.x && head.y === food.y){
        score++;
        if(score % 10 == 0){
            timeInterval = timeInterval - 50;
            gameInterval = setInterval(moveSnake , timeInterval);
        }
        scoreElement.textContent = score;
        deleteFood();
        placeFood();
    }
    else {
        snake.pop();
    }
    drawSnake();
}

const changeDirection = (event) => {
    if(directions[event.key]){
        const newDirection = directions[event.key];
        if(newDirection.x !== -startDirection.x || newDirection.y !== -startDirection.y){
            startDirection = newDirection;
        }
    }
}


document.addEventListener('keydown', changeDirection)
createStage();
drawSnake();
drawFood();
gameInterval = setInterval(moveSnake , timeInterval);
});
