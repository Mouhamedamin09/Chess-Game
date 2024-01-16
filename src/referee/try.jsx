function isEnPassant(px, py, x, y,type,team, piecePositions, prevMoveY) {
    //remebrer to sett prevMove condition to not be null
    const enemyDirection = team === 'W' ? -1 : 1;
    const enemyY = py + enemyDirection;
  
    if (piecePositions[enemyY][px]) {
      const enemyPiece = piecePositions[enemyY][px];
      console.log(enemyPiece)
      const [enemyTeam, enemyType] = [enemyPiece.slice(0, 1), enemyPiece.slice(2)];
  
      if (enemyTeam !== team && enemyType === 'pawn') {
        // Check if the last move was a double-step move by the enemy pawn
        const IntType= type === "W" ? 1: 6;
  
        if (
          prevMoveY===IntType && enemyY-prevMoveY   
        ) {
          // En passant move is valid
          return true;
        }
      }
    }
  
    return false;
  }
