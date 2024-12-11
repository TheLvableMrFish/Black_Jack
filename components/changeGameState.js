const changeGameState =(state)=>{

    let gameState = {
        start: false,
        bid: false,
        deal: false,
        play: false,
        stay: false,
        end: false,
        pay: false,
        bust: false
    }

    switch(state){
        case "start":
            gameState.start = true
            break
        case "bid":
            gameState.bid = true
            break
        case "deal":
            gameState.deal = true
            break
        case "stay":
            gameState.stay = true
            break
        case "play":
            gameState.play = true
            break;
        case "end":
            gameState.end = true
            break
        case "pay":
            gameState.pay = true
            break
        case "bust":
            gameState.bust = true
            break
        case "":
            break
        default:
            console.log(`Error in game state function, ${state} was passed and was not a valid choice`)
            break
    }

    return gameState
}

export default changeGameState