import React from 'react';
import './tile.css';

const Tile = ({ isBlack, piece,ind }) => {
  const pieceImage = piece ? `../../assets/images/${piece}.png` : null;

  return (
    <div className={`tile ${isBlack ? 'blacktile' : 'whitetile'}`}>
      {piece && <img ind={ind} className='chess-piece' src={pieceImage} alt={piece} draggable="false"  />}
    </div>
  );
};

export default Tile;




