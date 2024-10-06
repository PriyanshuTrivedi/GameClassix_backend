const n=5;

const extraNeededToCompleteRow=(i,j,board,numbersCalled)=>{
    let ans=n;
    for(k=0;k<n;k++){
        if(numbersCalled.includes(board[i][k])){
            ans--;
        }
    }
    return ans;
}
const extraNeededToCompleteColumn=(i,j,board,numbersCalled)=>{
    let ans=n;
    for(k=0;k<n;k++){
        if(numbersCalled.includes(board[k][j])){
            ans--;
        }
    }
    return ans;
}
const extraNeededToCompletePrimaryDiagonal=(board,numbersCalled)=>{
    let i,j,ans;
    i=j=0;
    ans=n;
    while(i<n){
        if(numbersCalled.includes(board[i][j])){
            ans--;
        }
        i++;
        j++;
    }
    return ans;
}
const extraNeededToCompleteSecondaryDiagonal=(board,numbersCalled)=>{
    let i,j,ans;
    i=0,j=n-1;
    ans=n;
    while(i<n){
        if(numbersCalled.includes(board[i][j])){
            ans--;
        }
        i++;
        j--;
    }
    return ans;
}
const calc=(i,j,board,numbersCalled)=>{
    const effectOfCallingThisNumber=[];
    effectOfCallingThisNumber.push(extraNeededToCompleteRow(i,j,board,numbersCalled));
    effectOfCallingThisNumber.push(extraNeededToCompleteColumn(i,j,board,numbersCalled));
    if(i==j){
        effectOfCallingThisNumber.push(extraNeededToCompletePrimaryDiagonal(board,numbersCalled));
    }
    if(i+j==n-1){
        effectOfCallingThisNumber.push(extraNeededToCompleteSecondaryDiagonal(board,numbersCalled));
    }
    effectOfCallingThisNumber.sort();
    return effectOfCallingThisNumber;
}

const isLexicographicallySmaller=(arr1,arr2)=>{
    let n1,n2,i;
    n1=arr1.length;
    n2=arr2.length;
    for(i=0;i<Math.min(n1,n2);i++){
        if(arr1[i]<arr2[i]){
            return true;
        }
    }
    return false;
}

const Bingo_FindOptimalNumber=(board,numbersCalled)=>{
    let i,j,pos;
    const arr_effectOfCalling=[];
    for(i=0;i<n;i++){
        for(j=0;j<n;j++){
            if(!numbersCalled.includes(board[i][j])){
                arr_effectOfCalling.push(calc(i,j,board,numbersCalled));
            }else
            arr_effectOfCalling.push([n+1]);
        }
    }
    let lexicographicallySmallestTillNow=[n+1];
    pos=-1;
    for(i=0;i<n;i++){
        for(j=0;j<n;j++){
            if(isLexicographicallySmaller(arr_effectOfCalling[i*n+j],lexicographicallySmallestTillNow)){
                lexicographicallySmallestTillNow=[...arr_effectOfCalling[i*n+j]];
                pos=i*n+j;
            }
        }
    }

    let possiblePos=[pos];
    for(i=0;i<n;i++){
        for(j=0;j<n;j++){
            if(JSON.stringify(arr_effectOfCalling[i*n+j])===JSON.stringify(lexicographicallySmallestTillNow)){
                possiblePos.push(i*n+j);
            }
        }
    }

    pos=possiblePos[Math.floor(Math.random()*possiblePos.length)];
    
    const res={
        posi:Math.floor(pos/n),
        posj:pos%n,
        numberOfIncompleteCells:lexicographicallySmallestTillNow
    };
    console.log(res);
    return res;
}


module.exports={
    Bingo_FindOptimalNumber
}