const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const swap=(i,j,indexes)=>{
    temp=indexes[i];
    indexes[i]=indexes[j];
    indexes[j]=temp;
}
const possIndex=(i,j,matrixSize)=>{
    return (i<0||j<0||i>=matrixSize||j>=matrixSize)?false:true;
}
const findRandomIndexesForMines=(matrixSize,numberOfMines)=>{
    const indexes=new Array(matrixSize*matrixSize);
    let i,randomIndex;
    for(i=0;i<matrixSize*matrixSize;i++){
        indexes[i]=i;
    }
    for(i=0;i<matrixSize*matrixSize;i++){
        randomIndex=Math.floor(matrixSize*matrixSize*Math.random());
        swap(i,randomIndex,indexes);
    }
    return indexes.slice(0,numberOfMines);
}
const checkForMine=(i,j,board,matrixSize)=>{
    if(!possIndex(i,j,matrixSize)){
        return false;
    }
    return (board[i*matrixSize+j]===-1)?true:false;
}
const updateBoard=(board,matrixSize)=>{
    let i,j,pos;
    for(pos=0;pos<matrixSize*matrixSize;pos++){
        if(board[pos]===-1){
            continue;
        }
        i=Math.floor(pos/matrixSize);
        j=pos%matrixSize;
        dirs.forEach(dir=>{
            if(checkForMine(i+dir[0],j+dir[1],board,matrixSize)){
                board[pos]++;
            }
        });
    }
}
function dfs(i,j,board,vis,groupNumber,matrixSize,group){
    if(!possIndex(i,j,matrixSize) || vis[i*matrixSize+j]===true || board[i*matrixSize+j]!==0){
        return;
    }
    vis[i*matrixSize+j]=true;
    groupNumber[i*matrixSize+j]=group;
    for(let k=0;k<dirs.length;k++){
        dfs(i+dirs[k][0],j+dirs[k][1],board,vis,groupNumber,matrixSize,group);
    }
}
const findGroupsOfZeroes=(board,matrixSize)=>{
    const groupNumber=new Array(matrixSize*matrixSize);
    const vis=new Array(matrixSize*matrixSize);
    groupNumber.fill(-1);
    vis.fill(false);
    let i,j,group;
    group=0;
    for(i=0;i<matrixSize;i++){
        for(j=0;j<matrixSize;j++){
            if(board[i*matrixSize+j]===0 && !vis[i*matrixSize+j]){
                dfs(i,j,board,vis,groupNumber,matrixSize,group);
                group++;
            }
        }
    }
    const indexesWithSameGroupNumber=new Array();
    for(i=0;i<group;i++){
        const tempArr=new Array();
        indexesWithSameGroupNumber.push(tempArr);
    }
    for(i=0;i<matrixSize;i++){
        for(j=0;j<matrixSize;j++){
            if(board[i*matrixSize+j]===0){
                indexesWithSameGroupNumber[groupNumber[i*matrixSize+j]].push(i*matrixSize+j);
            }
        }
    }
    const groupsOfZero={
        groupNumber:groupNumber,
        indexesWithSameGroupNumber:indexesWithSameGroupNumber
    };
    return groupsOfZero;
}
const createRandomBoard=(matrixSize,numberOfMines)=>{
    const board=new Array(matrixSize*matrixSize);
    board.fill(0);
    const randomIndexes=findRandomIndexesForMines(matrixSize,numberOfMines);
    randomIndexes.forEach(randomIndex=>{
        board[randomIndex]=-1;
    });
    updateBoard(board,matrixSize);
    const groupOfZeroInfo=findGroupsOfZeroes(board,matrixSize);

    let board_2d=[];
    let i,j;
    for(i=0;i<matrixSize;i++){
        let tempArr=[];
        for(j=0;j<matrixSize;j++){
            tempArr.push(board[matrixSize*i+j]);
        }
        board_2d.push(tempArr);
    }

    console.log(board_2d);

    return {
        board:board_2d,
        groupOfZeroInfo:groupOfZeroInfo,
        minesPos:randomIndexes
    };
}

const printBoard=()=>{
    let matrixSize,numberOfMines;
    matrixSize=10;
    numberOfMines=10;
    const {board,groupOfZeroInfo}=createRandomBoard(matrixSize,numberOfMines);
    for(let i=0;i<matrixSize;i++){
        for(j=0;j<matrixSize;j++){
            if(board[i*matrixSize+j]===-1){
                process.stdout.write("m ");
                continue;
            }
            process.stdout.write(board[i*matrixSize+j]+" ");
        }
        console.log();
    }
    console.log(groupOfZeroInfo);
}
// printBoard();

module.exports={
    createRandomBoard,
};