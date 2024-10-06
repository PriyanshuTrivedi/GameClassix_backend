const checkUp=(MatrixInfo,i,j)=>{
    const n=MatrixInfo.n;
    if(!(i-1>=0 && j+1<=n)){
        return -1;
    }
    return (MatrixInfo.horiLineMatrix[i-1][j]+MatrixInfo.vertLineMatrix[i-1][j]+MatrixInfo.vertLineMatrix[i-1][j+1]);
}
const checkDown=(MatrixInfo,i,j)=>{
    const n=MatrixInfo.n;
    if(!(i+1<=n && j+1<=n)){
        return -1;
    }
    return (MatrixInfo.horiLineMatrix[i+1][j]+MatrixInfo.vertLineMatrix[i][j]+MatrixInfo.vertLineMatrix[i][j+1]);
}
const checkLeft=(MatrixInfo,i,j)=>{
    const n=MatrixInfo.n;
    if(!(i+1<=n && j-1>=0)){
        return -1;
    }
    return (MatrixInfo.vertLineMatrix[i][j-1]+MatrixInfo.horiLineMatrix[i][j-1]+MatrixInfo.horiLineMatrix[i+1][j-1]);
}
const checkRight=(MatrixInfo,i,j)=>{
    const n=MatrixInfo.n;
    if(!(i+1<=n && j+1<=n)){
        return -1;
    }
    return (MatrixInfo.vertLineMatrix[i][j+1]+MatrixInfo.horiLineMatrix[i][j]+MatrixInfo.horiLineMatrix[i+1][j]);
}
const debug=(MatrixInfo)=>{
    console.log(MatrixInfo);
}
const checkAndUpdate=(MatrixInfo)=>{
    if(MatrixInfo.gain>MatrixInfo.maxGain){
        MatrixInfo.maxGain=MatrixInfo.gain;
        MatrixInfo.optimalChancesTaken=[...MatrixInfo.chancesTaken];
        // debug(MatrixInfo);
    }
}
function FindOptimalChances(MatrixInfo,isHoriLine,i,j){
    const n=MatrixInfo.n;
    if(isHoriLine===true){
        // if index out of bounds or line is already drawn
        if(i<0 || i>n || j<0 || j==n || MatrixInfo.horiLineMatrix[i][j]===true){
            checkAndUpdate(MatrixInfo);
            return;
        }
        // if drawing the current line helps in gaining a point 
        if(checkUp(MatrixInfo,i,j)===3 || checkDown(MatrixInfo,i,j)===3){
            MatrixInfo.horiLineMatrix[i][j]=true;
            const originalGain=MatrixInfo.gain;
            // if drawing the current line completes the box above and the box below
            if(checkUp(MatrixInfo,i,j)===3 && checkDown(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([1,i,j,"UD"]);
                MatrixInfo.gain=originalGain+2;
                checkAndUpdate(MatrixInfo);
                MatrixInfo.horiLineMatrix[i][j]=false;
                MatrixInfo.chancesTaken.pop();
                MatrixInfo.gain=originalGain;
                return;
            }
            // if drawing the current line completes the box above
            if(checkUp(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([1,i,j,"U"]);
                MatrixInfo.gain=originalGain+1;
                FindOptimalChances(MatrixInfo,false,i,j);
                FindOptimalChances(MatrixInfo,false,i,j+1);
                FindOptimalChances(MatrixInfo,true,i+1,j);
                MatrixInfo.chancesTaken.pop();
            }
            // if drawing the current line completes the box below
            else if(checkDown(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([1,i,j,"D"]);
                MatrixInfo.gain=originalGain+1;
                FindOptimalChances(MatrixInfo,false,i-1,j);
                FindOptimalChances(MatrixInfo,false,i-1,j+1);
                FindOptimalChances(MatrixInfo,true,i-1,j);
                MatrixInfo.chancesTaken.pop();
            }
            checkAndUpdate(MatrixInfo);
            MatrixInfo.horiLineMatrix[i][j]=false;
            MatrixInfo.gain=originalGain;
            return;
        }
        checkAndUpdate(MatrixInfo);
    }
    else{
        // if index out of bounds or line is already drawn
        if(i<0 || i==n || j<0 || j>n || MatrixInfo.vertLineMatrix[i][j]===true){
            checkAndUpdate(MatrixInfo);
            return;
        }
        // if drawing the current line helps in gaining a point 
        if(checkLeft(MatrixInfo,i,j)===3 || checkRight(MatrixInfo,i,j)===3){
            MatrixInfo.vertLineMatrix[i][j]=true;
            const originalGain=MatrixInfo.gain;
            // if drawing the current line completes the box on left and the box on right
            if(checkLeft(MatrixInfo,i,j)===3 && checkRight(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([0,i,j,"LR"]);
                MatrixInfo.gain=originalGain+2;
                checkAndUpdate(MatrixInfo);
                MatrixInfo.vertLineMatrix[i][j]=false;
                MatrixInfo.chancesTaken.pop();
                MatrixInfo.gain=originalGain;
                return;
            }
            // if drawing the current line completes the box on right
            if(checkRight(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([0,i,j,"R"]);
                MatrixInfo.gain=originalGain+1;
                FindOptimalChances(MatrixInfo,false,i,j-1);
                FindOptimalChances(MatrixInfo,true,i,j-1);
                FindOptimalChances(MatrixInfo,true,i+1,j-1);
                MatrixInfo.chancesTaken.pop();
            }
            // if drawing the current line completes the box on left 
            if(checkLeft(MatrixInfo,i,j)===3){
                MatrixInfo.chancesTaken.push([0,i,j,"L"]);
                MatrixInfo.gain=originalGain+1;
                FindOptimalChances(MatrixInfo,false,i,j+1);
                FindOptimalChances(MatrixInfo,true,i,j);
                FindOptimalChances(MatrixInfo,true,i+1,j);
                MatrixInfo.chancesTaken.pop();
            }
            checkAndUpdate(MatrixInfo);
            MatrixInfo.vertLineMatrix[i][j]=false;
            MatrixInfo.gain=originalGain;
            return;
        }
        checkAndUpdate(MatrixInfo);
    }
}
const findLineContributingToKSide=(MatrixInfo)=>{
    let ans=[
        [],
        [],
        [],
        []
    ];
    MatrixInfo.optimalChancesTaken.forEach(el => {
        if(el[0]===1){
            MatrixInfo.horiLineMatrix[el[1]][el[2]]=true;
        }
        else{
            MatrixInfo.vertLineMatrix[el[1]][el[2]]=true;
        }
    });
    // console.log(MatrixInfo);
    let i,j,n;
    n=MatrixInfo.n;
    for(i=0;i<n;i++){
        for(j=0;j<n;j++){
            if(MatrixInfo.horiLineMatrix[i][j]===false){
                ans[Math.max(checkUp(MatrixInfo,i,j),checkDown(MatrixInfo,i,j))].push([1,i,j]);
            }
            if(MatrixInfo.vertLineMatrix[i][j]===false){
                ans[Math.max(checkLeft(MatrixInfo,i,j),checkRight(MatrixInfo,i,j))].push([0,i,j]);
            }
        }
    }
    for(i=0;i<n;i++){
        if(!MatrixInfo.horiLineMatrix[n][i]){
            ans[checkUp(MatrixInfo,n,i)].push([1,n,i]);
        }
        if(!MatrixInfo.vertLineMatrix[i][n]){
            ans[checkLeft(MatrixInfo,i,n)].push([0,i,n]);
        }
    }
    MatrixInfo.optimalChancesTaken.forEach(el => {
        if(el[0]===1){
            MatrixInfo.horiLineMatrix[el[1]][el[2]]=false;
        }
        else{
            MatrixInfo.vertLineMatrix[el[1]][el[2]]=false;
        }
    });
    return ans;
}

const cnvrtmatrixToBool=(arr2d)=>{
    let i,j,n,m;
    n=arr2d.length;
    m=arr2d[0].length;
    let ans=[];
    for(i=0;i<n;i++){
        let tans=[];
        for(j=0;j<m;j++){
            if(arr2d[i][j]===-1){
                tans.push(false);
            }else{
                tans.push(true);
            }
        }
        ans.push(tans);
    }
    return ans;
}
const DotAndBoxes_FindOptimalMove=(horiLineMatrix_param,vertLineMatrix_param,difficulty)=>{
    try{
        const n=vertLineMatrix_param.length;
        const horiLineMatrix=cnvrtmatrixToBool(horiLineMatrix_param);
        const vertLineMatrix=cnvrtmatrixToBool(vertLineMatrix_param);
        let MatrixInfo={
            n:n,
            horiLineMatrix:horiLineMatrix,
            vertLineMatrix:vertLineMatrix,
            gain:0,
            chancesTaken:[],
            maxGain:0,
            optimalChancesTaken:[]
        }
        let i,j;
        for(i=0;i<n;i++){
            for(j=0;j<n;j++){
                FindOptimalChances(MatrixInfo,true,i,j);
                FindOptimalChances(MatrixInfo,false,i,j);
            }
        }
        for(i=0;i<n;i++){
            FindOptimalChances(MatrixInfo,true,n,i);
            FindOptimalChances(MatrixInfo,false,i,n);
        }

        // debug(MatrixInfo);

        let response={
            optimalChancesTakenInSequence:[...MatrixInfo.optimalChancesTaken],
            gain:MatrixInfo.maxGain
        }

        let LineContributingToOneSide,LineContributingToTwoSide,LineContributingToThreeSide,LineContributingToFourSide;
        let LineContributingToKSide=findLineContributingToKSide(MatrixInfo);

        // console.log(LineContributingToKSide);
        
        LineContributingToOneSide=LineContributingToKSide[0];
        LineContributingToTwoSide=LineContributingToKSide[1];
        LineContributingToThreeSide=LineContributingToKSide[2];
        LineContributingToFourSide=LineContributingToKSide[3];

        let probability;
        switch(difficulty){
            case `easy`:
                probability=0.7+Math.random();
                break;
            case `medium`:
                probability=0.85+Math.random();
                break;  
            case `hard`:
                probability=1;
        }

        if(probability>=1){
            if(LineContributingToOneSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToOneSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToOneSide[randomIndex]);
                return response;
            }
            if(LineContributingToTwoSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToTwoSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToTwoSide[randomIndex]);
                return response;
            }
            if(LineContributingToThreeSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToThreeSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToThreeSide[randomIndex]);
                return response;
            }
        }
        else if(probability>=0.8){
            if(LineContributingToTwoSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToTwoSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToTwoSide[randomIndex]);
                return response;
            }
            if(LineContributingToThreeSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToThreeSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToThreeSide[randomIndex]);
                return response;
            }
            if(LineContributingToOneSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToOneSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToOneSide[randomIndex]);
                return response;
            }
        }
        else{
            if(LineContributingToThreeSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToThreeSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToThreeSide[randomIndex]);
                return response;
            }
            if(LineContributingToTwoSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToTwoSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToTwoSide[randomIndex]);
                return response;
            }
            if(LineContributingToOneSide.length!==0){
                const randomIndex=Math.floor(Math.random()*LineContributingToOneSide.length);
                response.optimalChancesTakenInSequence.push(LineContributingToOneSide[randomIndex]);
                return response;
            }
        }
        return response;
    }catch(e){
        console.log(e);
    }
}
module.exports={
    DotAndBoxes_FindOptimalMove,
};