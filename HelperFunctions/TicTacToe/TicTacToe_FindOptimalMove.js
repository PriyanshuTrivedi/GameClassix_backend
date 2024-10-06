// assuming 1 for chance taken by computer and -1 for chance taken by user and 0 for empty
// so i assume number of -1s -number of 1s <=1 as it is now computers chance 
const initialFillCanTake=(canTake,board)=>{
    let i,n;
    n=3;
    for(i=0;i<n*n;i++){
        if(board[i]===0){
            canTake.add(i);
        }
    }
}
const convertTo1Dboard=(board,board2D)=>{
    let i,j,n;
    n=3;
    for(i=0;i<n;i++){
        for(j=0;j<n;j++){
            board.push(board2D[i][j]);
        }
    }
}
const checkPrimaryDiagonal=(board)=>{
    if(board[0]===board[4] && board[4]===board[8]){
        return board[0];
    }
    return 0;
}
const checkSecondaryDiagonal=(board)=>{
    if(board[2]===board[4] && board[4]===board[6]){
        return board[2];
    }
    return 0;
}
const checkKthRow=(k,board)=>{
    if(board[k*3]===board[k*3+1] && board[k*3+1]===board[k*3+2]){
        return board[k*3];
    }
    return 0;
}
const checkKthColumn=(k,board)=>{
    if(board[k]===board[k+3] && board[k+3]===board[k+6]){
        return board[k];
    }
    return 0;
}
const checkWinner=(board)=>{
    let i,n,temp;
    n=3;
    for(i=0;i<n;i++){
        temp=checkKthRow(i,board);
        if(temp!=0){
            return temp;
        }
        temp=checkKthColumn(i,board);
        if(temp!=0){
            return temp;
        }
    }
    temp=checkPrimaryDiagonal(board);
    if(temp!=0){
        return temp;
    }
    temp=checkSecondaryDiagonal(board);
    if(temp!=0){
        return temp;
    }
    return 0;
}
const findOptimalMove=(canTake,board,compChance,finalResults)=>{
    const winner=checkWinner(board);
    if(winner!=0){
        finalResults.totalCases++;
        if(winner===1){
            // can win
            finalResults.totalWins++;
            return 1;
        }
        // definetily lose 
        finalResults.totalLoses++;
        return -1;
    }
    if(canTake.size===0){
        // can take to draw 
        finalResults.totalCases++;
        finalResults.totalDraws++;
        return 0;
    }
    let tempCanTake=new Set(canTake);
    if(compChance){
        let tans=-10;
        for(let el of tempCanTake){
            board[el]=1;
            canTake.delete(el);
            tans=Math.max(tans,findOptimalMove(canTake,board,!compChance,finalResults))
            canTake.add(el);
            board[el]=0;
        }
        return tans;
    }
    else{
        let tans=10;
        for(let el of tempCanTake){
            board[el]=-1;
            canTake.delete(el);
            tans=Math.min(tans,findOptimalMove(canTake,board,!compChance,finalResults))
            canTake.add(el);
            board[el]=0;
        }
        return tans;
    }
}
const cnvrtBoard=(board)=>{
    let i,j;
    let ans=[];
    for(i=0;i<3;i++){
        let temp=[];
        for(j=0;j<3;j++){
            if(board[i][j]==0){
                temp.push(-1);
            }else if(board[i][j]==1){
                temp.push(1);
            }else{
                temp.push(0);
            }
        }
        ans.push(temp);
    }
    return ans;
}
const TicTacToe_FindOptimalMove=(given_board_in_indexForm)=>{
    const board2D=cnvrtBoard(given_board_in_indexForm);
    let board=[];
    let canTake=new Set();
    convertTo1Dboard(board,board2D);
    initialFillCanTake(canTake,board);
    // its surely win and surely draw cause whether or not the player player optimally the computer can win or do draw but its can lose as player may play some non optimal move 
    let impactOfFillingBox=[],surelyWin=[],surelyDraw=[],canLose=[];
    let i,n,temp;
    n=3;
    for(i=0;i<n*n;i++){
        if(board[i]===0){
            let finalResults={
                boxPos:i,
                totalCases:0,
                totalWins:0,
                totalLoses:0,
                totalDraws:0
            }
            board[i]=1;
            canTake.delete(i);
            temp=findOptimalMove(canTake,board,false,finalResults);
            if(temp===0){
                surelyDraw.push(i);
            }
            else if(temp===1){
                surelyWin.push(i);
            }
            else{
                canLose.push(i);
            }
            board[i]=0;
            canTake.add(i);
            impactOfFillingBox.push(finalResults);
        }
    }
    return {
        impactOfFillingBox:impactOfFillingBox,
        surelyDraw:surelyDraw,
        surelyWin:surelyWin,
        canLose:canLose
    };
}

module.exports={
    TicTacToe_FindOptimalMove,
}
