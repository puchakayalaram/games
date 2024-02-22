import { useEffect, useState } from "react";
import BlueCandy from './images/blue-candy.png';
import GreenCandy from './images/green-candy.png';
import OrangeCandy from './images/orange-candy.png';
import PurpleCandy from './images/purple-candy.png';
import RedCandy from './images/red-candy.png';
import YellowCandy from './images/yellow-candy.png';
import Blank from './images/blank.png';
import ScoreBoard from "./Components/ScoreBoard";

const width =8
const candyColors=[
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy
]

const App =()=> {

  const [currentColorArrangement,setCurrentArrangement]=useState([])
  const [squareBeingDragged,setSquareBeingDragged]=useState(null)
  const [squareBeingReplaced,setSquareBeingReplaced]=useState(null)
  const [scoreDisplay,setScoreDisplay]=useState(0)

  const checkForColumnofThree=()=>{
    for(let i=0;i<=47;i++){
      const columnOfThree=[i,i+width,i+width*2]
      const decidedColor=currentColorArrangement[i]
      const isBlank=currentColorArrangement[i]=== Blank

      if(columnOfThree.every(square =>currentColorArrangement[square]===decidedColor) && !isBlank){
        setScoreDisplay((score)=>score+3)
        columnOfThree.forEach(square=>currentColorArrangement[square]=Blank)
        return true
      }
    }
  }
  const checkForColumnofFour=()=>{
    for(let i=0;i<=39;i++){
      const columnOfFour=[i,i+width,i+width*2,i+width*3]
      const decidedColor=currentColorArrangement[i]
      const isBlank=currentColorArrangement[i]=== Blank

      if(columnOfFour.every(square =>currentColorArrangement[square]===decidedColor) && !isBlank){
        setScoreDisplay((score)=>score+4)
        columnOfFour.forEach(square=>currentColorArrangement[square]=Blank)
        return true
      }
    }
  }
  const checkForRowofThree=()=>{
    for(let i=0;i<64;i++){
      const rowOfThree=[i,i+1,i+2]
      const decidedColor=currentColorArrangement[i]
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      const isBlank=currentColorArrangement[i]=== Blank
      if(notValid.includes(i)) continue

      if(rowOfThree.every(square =>currentColorArrangement[square]===decidedColor) && !isBlank){
        setScoreDisplay((score)=>score+3)
        rowOfThree.forEach(square=>currentColorArrangement[square]=Blank)
        return true
      }
    }
  }
  const checkForRowofFour=()=>{
    for(let i=0;i<64;i++){
      const rowOfFour=[i,i+1,i+2,i+3]
      const decidedColor=currentColorArrangement[i]
      const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
      const isBlank=currentColorArrangement[i]=== Blank
      if(notValid.includes(i)) continue

      if(rowOfFour.every(square =>currentColorArrangement[square]===decidedColor) && !isBlank){
        setScoreDisplay((score)=>score+4)
        rowOfFour.forEach(square=>currentColorArrangement[square]=Blank)
        return true
      }
    }
  }
  const moveIntoSquareBelow=()=>{
    for(let i=0;i<=55;i++){
      const firstRow=[0,1,2,3,4,5,6,7]
      const isFirstRow=firstRow.includes(i)

      if(isFirstRow && currentColorArrangement[i]===Blank){
        let randomNumber=Math.floor(Math.random()*candyColors.length)
        currentColorArrangement[i]=candyColors[randomNumber]
      }
      if((currentColorArrangement[i+width])===Blank){
        currentColorArrangement[i+width]=currentColorArrangement[i]
        currentColorArrangement[i]=Blank
      }
    }
  }
  const dragStart=(e)=>{
    setSquareBeingDragged(e.target)
  }
  const dragDrop=(e)=>{
    setSquareBeingReplaced(e.target)
  }
  const dragEnd=()=>{

    const squareBeingDraggedId= parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId= parseInt(squareBeingReplaced.getAttribute('data-id'))

    const validMoves=[
      squareBeingDraggedId-1,
      squareBeingDraggedId-width,
      squareBeingDraggedId+1,
      squareBeingDraggedId+width
    ]

    const validMove= validMoves.includes(squareBeingReplacedId)

    const isAColumnofFour=checkForColumnofFour()
    const isARowofFour=checkForRowofFour()
    const isAColumnofThree=checkForColumnofThree()
    const isARowofThree=checkForRowofThree()

    if(squareBeingReplaced && validMove || (isAColumnofFour || isARowofFour || isAColumnofThree || isARowofThree)){
      currentColorArrangement[squareBeingReplacedId]=squareBeingDragged.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId]=squareBeingReplaced.getAttribute('src')
      setCurrentArrangement([...currentColorArrangement])
    }else{
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    }
  }

  const createBoard=()=>{
    const randomColorArrangement=[]
    for(let i=0; i<width*width; i++){
      const randomColor= candyColors[Math.floor(Math.random()*candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    setCurrentArrangement(randomColorArrangement)
  }

  useEffect(()=>{
    createBoard();
  },[])

  useEffect(()=>{
    const timer=setInterval(()=>{
      checkForColumnofFour()
      checkForRowofFour()
      checkForColumnofThree()
      checkForRowofThree()
      moveIntoSquareBelow()
      setCurrentArrangement([...currentColorArrangement])
    },100)
    return ()=>clearInterval(timer)
  },[checkForColumnofFour,checkForRowofFour,checkForColumnofThree,checkForRowofThree,moveIntoSquareBelow,currentColorArrangement])

  return (
    <div className="app">
      <div className="game">
        {
            currentColorArrangement.map((candyColor,index)=>(
            <img key={index} 
            src={candyColor}
            alt={candyColor} 
            data-id={index} 
            draggable={true}
            onDragStart={dragStart} 
            onDragOver={(e)=>e.preventDefault()}
            onDragEnter={(e)=>e.preventDefault()}
            onDragLeave={(e)=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            />
            ))
        }
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
