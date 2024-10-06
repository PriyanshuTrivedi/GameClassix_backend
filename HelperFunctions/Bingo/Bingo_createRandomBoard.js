const n=5;

const swap=(arr,i,j)=>{
    let temp=arr[i];
    arr[i]=arr[j];
    arr[j]=temp;
}
const Bingo_createRandomBoard=()=>{
    const arr=[],board=[];
    for(i=1;i<=n*n;i++){
        arr.push(i);
    }
    for(i=0;i<n*n;i++){
        swap(arr,i,Math.floor((n*n)*Math.random()));
    }
    for(i=0;i<n;i++){
        const temp=[];
        for(j=0;j<n;j++){
            temp.push(arr[i*n+j]);
        }
        board.push(temp);
    }
    res={
        board:board,
    }
    return res;
}

module.exports={
    Bingo_createRandomBoard,
}