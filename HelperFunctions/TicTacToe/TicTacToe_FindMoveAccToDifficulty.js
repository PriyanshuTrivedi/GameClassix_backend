const {TicTacToe_FindOptimalMove}=require('./TicTacToe_FindOptimalMove');

const compWithPrev=(ans,el,compLoss)=>{
    if(compLoss===false){
        return (el.totalLoses*ans.totalCases>=ans.totalLoses*el.totalCases);
    }
    return (el.totalLoses*ans.totalCases<=ans.totalLoses*el.totalCases);
}
const findOneWithLeastLossPercentage=(optimalMovesDetailes)=>{
    let ans={
        boxPos:-1,
        totalCases:0,
        totalLoses:0
    };
    optimalMovesDetailes.impactOfFillingBox.forEach(el => {
        if(compWithPrev(ans,el,true)){
            ans={...el};
        }
    });
    if(ans.boxPos===-1){
        console.log('least loss m phsra');
        console.log(optimalMovesDetailes.impactOfFillingBox);
    }
    return ans.boxPos;
}
const findOneWithLeastWinPercentage=(optimalMovesDetailes)=>{
    let ans={
        boxPos:-1,
        totalCases:0,
        totalLoses:0
    };
    optimalMovesDetailes.impactOfFillingBox.forEach(el => {
        if(compWithPrev(ans,el,false)){
            ans={...el};
        }
    });
    if(ans.boxPos===-1){
        console.log('least win m phsra');
        console.log(optimalMovesDetailes.impactOfFillingBox);
    }
    return ans.boxPos;
}
const solveAccToDifficulty=(difficulty,optimalMovesDetailes)=>{
    let probability=1;
    switch(difficulty){
        case "easy":
            probability=0.7+Math.random();
            break;
        case "medium":
            probability=0.8+Math.random();
            break;
        case "hard":
            probability=1;
            break;
    }
    let tempIndex;
    if(probability>=1){
        if(optimalMovesDetailes.surelyWin.length>0){
            tempIndex=optimalMovesDetailes.surelyWin[Math.floor(optimalMovesDetailes.surelyWin.length*Math.random())];
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
        else if(optimalMovesDetailes.surelyDraw.length>0){
            tempIndex=optimalMovesDetailes.surelyDraw[Math.floor(optimalMovesDetailes.surelyDraw.length*Math.random())];
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
        else{
            tempIndex=findOneWithLeastLossPercentage(optimalMovesDetailes);
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
    }
    else if(probability>=0.9){
        if(optimalMovesDetailes.surelyDraw.length>0){
            tempIndex=optimalMovesDetailes.surelyDraw[Math.floor(optimalMovesDetailes.surelyDraw.length*Math.random())];
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
        else if(optimalMovesDetailes.surelyWin.length>0){
            tempIndex=optimalMovesDetailes.surelyWin[Math.floor(optimalMovesDetailes.surelyWin.length*Math.random())];
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
        else{
            tempIndex=findOneWithLeastLossPercentage(optimalMovesDetailes);
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
    }
    else{
        if(optimalMovesDetailes.canLose.length>0){
            tempIndex=optimalMovesDetailes.canLose[Math.floor(optimalMovesDetailes.canLose.length*Math.random())];
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
        else{
            tempIndex=findOneWithLeastWinPercentage(optimalMovesDetailes);
            return {
                row:Math.floor(tempIndex/3),
                column:tempIndex%3
            };
        }
    }
}
const TicTacToe_FindMoveAccToDifficulty=(difficulty,board)=>{
    const optimalMovesDetailes=TicTacToe_FindOptimalMove(board);
    const result=solveAccToDifficulty(difficulty,optimalMovesDetailes);
    return result;
}

module.exports={
    TicTacToe_FindMoveAccToDifficulty,
}