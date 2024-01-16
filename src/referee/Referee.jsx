class Referee {
    isValidMove(px, py, x, y, type, team,piecePositions,passant,castling,CastlingCon,PlayerTurn,setPlayerTurn) {
      
     
  
      if (PlayerTurn!==team){
        return false
      }
      if(castling && CastlingCon){
        
        return true;
      }
      
      const isDestinationOccupied = piecePositions[y][x] !== null;

      //castling move check
     
      
      let enemy =  piecePositions[y][x] ? piecePositions[y][x].slice(0, 1): null;
      //check if the tile occupied and not the same team
      if(isDestinationOccupied &&  team === enemy){
        return false;
      }

      if(isDestinationOccupied &&  team !== enemy && type ==="pawn" && Math.abs(px - x)===1 &&  ((team === "W" && y - py === 1) || (team === "B" && py - y === 1))  ){
        return true;
      }


      if(passant){
        return true;
      }

      


      // Check if the path is clear (no jumping over pieces)
    const isPathClear = this.isPathClear(px, py, x, y, type, piecePositions) ;
    if (!isPathClear &&  type !=="knight") {
      return false
    }


    
      switch (type) {
        case "pawn":
          // Pawn movement rules
          if (team === "W") {
            // White pawn moves forward
            if (y - py === 1 && px === x && ! isDestinationOccupied) {
              return true;
            }
            // White pawn's first move can be two squares forward
            else if (py === 1 && y - py === 2 && px === x ) {
              return true;
            }
          } else {
            // Black pawn moves forward
            if (py - y === 1 && px === x  && ! isDestinationOccupied) {
              return true;
            }
            // Black pawn's first move can be two squares forward
            else if (py === 6 && py - y === 2 && px === x) {
              return true;
            }
          }
          break;
  
        case "rook":
          // Rook moves horizontally or vertically
          if ((py === y && px !== x) || (px === x && py !== y)) {
            return true;
          }
          break;
  
        case "knight":
          // Knight moves in an L-shape (2 squares in one direction and 1 square perpendicular)
          const dx = Math.abs(px - x);
          const dy = Math.abs(py - y);
          if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
            return true;
          }
          break;
  
        case "bishop":
          // Bishop moves diagonally
          if (Math.abs(px - x) === Math.abs(py - y)) {
            return true;
          }
          break;
  
        case "queen":
          // Queen moves horizontally, vertically, or diagonally
          if ((py === y && px !== x) || (px === x && py !== y) || Math.abs(px - x) === Math.abs(py - y)) {
            return true;
          }
          break;
  
        case "king":
          // King moves one square in any direction
          if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
            return true;
          }
          break;
  
        default:
          break;
      }


  
      return false;
    }


    isPathClear(px, py, x, y, type, piecePositions) {
      const dx = Math.sign(x - px);
      const dy = Math.sign(y - py);
  
      let currentX = px + dx;
      let currentY = py + dy;
  
      while (currentX !== x || currentY !== y) {
        if (piecePositions[currentY][currentX] !== null) {
          // There is a piece in the path
          return false;
        }
        currentX += dx;
        currentY += dy;
      }
  
      return true;
    }



     isEnPassant(px, py, x, y,type,team, piecePositions, prevMoveY,prevMoveX) {
      //remebrer to sett prevMove condition to not be null
      const enemyDirection = team === 'B' ? +1 : -1;
      const enemyY = y +enemyDirection
      
      if(prevMoveX === null){
        return false
      }
      if (type==="pawn" &&piecePositions[enemyY][prevMoveX])  {
        
        const enemyPiece =piecePositions[enemyY][prevMoveX];
        const [enemyTeam, enemyType] = [enemyPiece.slice(0, 1), enemyPiece.slice(2)];

        
        if(enemyType==="pawn" && enemyTeam !== team ){
          const IntType= team === "W" ? 6: 1;
          if (
            prevMoveY===IntType && Math.abs(prevMoveY-enemyY)===2  
          ) {
            // En passant move is valid
            return true;
          }

          
        }


          
      
    }else{
      return false;
    }
  }

   isCastling(px,py,x,y,type,team,piecePositions){
    if (type === 'king' && Math.abs(px - x) === 2 && py === y && this.isPathClear(px, py, x, y, type, piecePositions) && piecePositions[y][x]===null) {
      

      const rookX = px < x ?  7 : 0; // Rook's x position after castling
      const rookY = team==="W" ? 0 : 7 // Rook's y position
      
      
      if(piecePositions[rookY][rookX]){
        
       
        return true;
      }

      
    }
    return false;
  }

}
  

 
  
  
  
  export default Referee;
  