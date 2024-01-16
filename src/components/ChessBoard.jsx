import React, { useEffect,useState } from 'react';
import './ChessBoard.css';
import Tile from './Tile/Tile';
import Referee from '../referee/referee';

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

const initialPieces = [
  ["W-rook", "W-knight", "W-bishop", "W-queen", "W-king", "W-bishop", "W-knight", "W-rook"],
  ["W-pawn", "W-pawn", "W-pawn", "W-pawn", "W-pawn", "W-pawn", "W-pawn", "W-pawn"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["B-pawn", "B-pawn", "B-pawn", "B-pawn", "B-pawn", "B-pawn", "B-pawn", "B-pawn"],
  ["B-rook", "B-knight", "B-bishop", "B-queen", "B-king", "B-bishop", "B-knight", "B-rook"],
];





const ChessBoard = () => {
  const [PlayerTurn,setPlayerTurn]=useState("W")
  const [CastlingCon, setCastlingCon] = useState(true);
  const [prevMoveX, setPrevMoveX] = useState(null);
  const [prevMoveY, setPrevMoveY] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [piecePositions, setPiecePositions] = useState(initialPieces);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [InX, setInX] = useState(null);
  const [InY, setInY] = useState(null);
  let board = [];
  const referee=new Referee();


  useEffect(() => {
    console.log('Turn is switched to the', PlayerTurn, 'successfully');
  }, [PlayerTurn])


  function grab_piece(e) {
    if (e.target.className === "chess-piece") {
      const x = e.clientX - 40;
      const y = e.clientY - 40;
      e.target.style.position = "absolute";
      e.target.style.left = `${x}px`;
      e.target.style.top = `${y}px`;
      
    
      
      setDraggedPiece(e.target);
      

      const chessboard = document.querySelector('.chessboard');
      const chessboardRect = chessboard.getBoundingClientRect();
      const InX =Math.floor((e.clientX - chessboardRect.left)/90);
      const inversetInY =Math.floor((e.clientY - chessboardRect.top)/90);
      const InY=(7 - inversetInY + 8) % 8 //inverse the Y cuz the board matrix inversed
      setInX(InX)
      setInY(InY)
      console.log(`InX:${InX} InY:${InY} `)

    

  
    }
  }



  
  
  

  function Move_piece(e) {
    setMouseCoords({ x: e.clientX, y: e.clientY });
    
    if (draggedPiece) {
      
      const chessboard = document.querySelector('.chessboard');
      const chessboardRect = chessboard.getBoundingClientRect();
      
      
  
      const minX = chessboardRect.left;
      const minY = chessboardRect.top;
      const maxX = chessboardRect.right - draggedPiece.clientWidth;
      const maxY = chessboardRect.bottom - draggedPiece.clientHeight;
  
      let x = Math.min(maxX+35, Math.max(minX - 35, e.clientX - draggedPiece.clientWidth / 2));
      let y = Math.min(maxY+35, Math.max(minY - 35, e.clientY - draggedPiece.clientHeight / 2));
  
     
      draggedPiece.style.position = 'absolute';
      draggedPiece.style.left = `${x}px`;
      draggedPiece.style.top = `${y}px`;
  

      
    }
  }




  
  function drop_piece(e) {
    if (draggedPiece) {
      
      const { gridX, gridY } = DropMoveCordinates(e);
  
      setPiecePositions((prevPositions) => {
        const newPositions = JSON.parse(JSON.stringify(prevPositions));
  
        if (InX !== null && InY !== null && gridX !== null && gridY !== null) {

          
  
          if (InX === gridX && InY === gridY ) {
            
          
            // Reset the transformation properties
            ReturnPosition();
  
            return newPositions;
          } else {

            
            const type = draggedPiece.alt ? draggedPiece.alt.slice(2) : null;
            const team = draggedPiece.alt ? draggedPiece.alt.slice(0, 1) : null;
            
            const passant=referee.isEnPassant(InX, InY, gridX, gridY, type, team,piecePositions,prevMoveY,prevMoveX)
            console.log(passant)

            const castling =referee.isCastling(InX,InY,gridX,gridY,type,team,piecePositions);
            
            const movedPiece = newPositions[InY][InX];
            if (type && team && referee.isValidMove(InX, InY, gridX, gridY, type, team,piecePositions,passant,castling,CastlingCon,PlayerTurn,setPlayerTurn)) {

              
              
              newPositions[InY][InX] = null;
              newPositions[gridY][gridX] = movedPiece;


              if(movedPiece ==="W-rook" ||movedPiece ==="B-rook" || movedPiece ==="B-king" || movedPiece ==="W-king"  ){
                setCastlingCon(false)
              }
  
              
              // set the prevouis move cordinations for the enPassant function
              if(castling){
                const Direction= InX <gridX ? 1 : -2;
                const DirectionX= InX <gridX ? -1 : 1;
                piecePositions[gridY][gridX+Direction]=null;
                const RookPiece= team==="W" ? "W-rook" : "B-rook"
                piecePositions[gridY][gridX+DirectionX]=RookPiece;

                
                piecePositions[InY][InX]=null;
                piecePositions[gridY][gridX]=movedPiece;


              }
              
              if(passant){
                piecePositions[InY][gridX]=null;
                piecePositions[InY][InX]=null;
                piecePositions[gridY][gridX]=movedPiece;
                
              }
              setPrevMoveY(InY);
              setPrevMoveX(gridX);
              //change the the play turn
              setPlayerTurn((prevTurn) => (prevTurn === "W" ? "B" : "W"));
              ;

              
              
            } else {
              ReturnPosition();
            }
          }
        }
  
        return newPositions;
      });
  
      setDraggedPiece(null);
    }
  }
  
  
  function ReturnPosition(){
    draggedPiece.style.position = "relative";
    draggedPiece.style.left = "0";
    draggedPiece.style.top = "0";
    draggedPiece.style.transform = "none";
  }
  
  

  

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const isBlack = (i + j) % 2 === 0;
      const piece = piecePositions[j][i];
  
      const key = `${i}${j}`;

      board.push(
        <Tile key={key} isBlack={isBlack} piece={piece} />
      );
    }
  }

  function DropMoveCordinates(e){
    const chessboard = document.querySelector('.chessboard');
      const chessboardRect = chessboard.getBoundingClientRect();
      const gridX = Math.floor((e.clientX - chessboardRect.left) / 90);
      const inversedgridY = Math.floor((e.clientY - chessboardRect.top) / 90);
      const gridY = (7 - inversedgridY + 8) % 8;
      console.log(`gridX:${gridX} gridY:${gridY} `)

       const Cord ={gridX:gridX ,gridY :gridY}


       return Cord;


  }

  return (
    <div onMouseMove={e => Move_piece(e)} onMouseDown={e =>grab_piece(e)} onMouseUp={e =>drop_piece(e)} className='chessboard'>
      {board}
    </div>
  );
};

export default ChessBoard;

