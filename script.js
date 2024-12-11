import {LitElement, html, css} from 'lit'

import { gameCards } from './components/gameCards'
import { winBanner } from './components/winBanner'
import { playerScore } from './components/playerScore'
import { chipTable } from './components/chipTable'

import deck from './components/deck'
import changeGameState from './components/changeGameState'

export class scriptJS extends LitElement{

    static properties = {
        value: {},
        dealersHand: {type: Array},
        dealersHandValue: {type: Number},
        playersHand: {type: Array},
        playersHandValue: {type: Number},
        cardsInPlay: {type: Array},
        isPlayer: {type: Boolean},
        gameState: {type: Object},
        isWinner: {type: String},
        betAmount: {type: Number},
        playerMoney: {type: Number},
    }

    static styles = css
    `

    .dealer{
        text-align: center;
        margin-top: 10px;
        margin-left: 60px;
    }

    .player{
        text-align: center;
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        margin-left: 60px;
    }

    .btn{
        background-color: white;
        border-radius: 4px;
        text-align: center;
        color: black;
        position: absolute;
        padding: 14px 10px !important;
        width: 90px;
        padding: 15px 25px;
        transform: translate(-50%, -50%);
    }

    .btn:hover{
        box-shadow: none;
        cursor: pointer;
    }

    .deal{
        top: 50%;
        left: 50%;
    }

    .hit{
        position: absolute;
        top: 65%;
        left: 25%;
    }

    .stay{

        position: absolute;
        top: 65%;
        left: 75%;
    }

    .game-over{
        top: 50%;
        left: 50%;
    }

    .card{
        margin-left: -60px;
    }

    .banner{
        max-width: 50px;
    }

    `

    constructor(){
        super()
        this.value = ""
        this.dealersHand = []
        this.dealersHandValue = 0
        this.playersHand = []
        this.playersHandValue = 0
        this.cardsInPlay = []
        this.isPlayer = false
        this.gameState = {
            start: true,
            bid: false,
            deal: false,
            play: false,
            stay: false,
            calc: false,
            end: false,
            pay: false,
            bust: false
        }
        this.isWinner = ""
        this.betAmount = 0
        this.playerMoney = 1000
    }

    firstUpdated(){

        changeGameState('start')

        const chipTable = this.shadowRoot.querySelector('chip-table')

        this.updateGameState()

        chipTable.addEventListener('game-state-changed', this.handleGameStateChanged)
        chipTable.addEventListener('bet-changed', this.handleBetChanged)
    }

    updateGameState(){
        const chipTable = this.shadowRoot.querySelector('chip-table')
        chipTable.gameState = this.gameState
        chipTable.requestUpdate()
    }

    handleGameStateChanged =(e)=>{
        this.gameState = e.detail.gameState
        this.updateGameState()
    }

    handleBetChanged =(e)=>{
        this.betAmount = e.detail.betAmount
        this.playerMoney = e.detail.playerMoney
        this.gameState = changeGameState('start')
    }

    gameOver(){
        this.playerMoney = 1000
        this.gameState = changeGameState('start')
    }

    restart(){
        this.dealersHand = []
        this.dealersHandValue = 0
        this.playersHand = []
        this.playersHandValue = 0
        this.cardsInPlay = []
        this.betAmount = 0
        if(this.betAmount == 0 && this.playerMoney == 0){
            this.gameState = changeGameState('bust')
        }
    }

    start(){
        
        this.gameState = changeGameState('deal')
        this.updateGameState()

        const dealCards =()=>{
            this.getBlank()
            setTimeout(() => this.getCard(true), 500)
            setTimeout(() => this.getCard(false), 1000)
            setTimeout(() => this.getCard(true), 1500)
            setTimeout(() => this.gameState = changeGameState('play'), 1500)
        }
        dealCards()
    }
    
    getBlank(){
        this.dealersHand = [['back', '0deg', 0]]
    }

    checkForA(isPlayer){
        let currentPlayer = isPlayer
        let foundFirstA = false
        let newScore = 0

        if(currentPlayer){
            this.playersHand = this.playersHand.map(subArr =>{
                if(!foundFirstA && subArr.includes(11)){
                    foundFirstA = true
                    return subArr.map(cardPoints => cardPoints === 11 ? 1 : cardPoints)
                }
                return subArr
            })
    
            for(let i = 0; i < this.playersHand.length; i++){
                newScore += this.playersHand[i][2]
            }
    
            this.playersHandValue = newScore
        } else {
            this.dealersHand = this.dealersHand.map(subArr =>{
                if(!foundFirstA && subArr.includes(11)){
                    foundFirstA = true
                    return subArr.map(cardPoints => cardPoints === 11 ? 1 : cardPoints)
                }
                return subArr
            })
    
            for(let i = 0; i < this.dealersHand.length; i++){
                newScore += this.dealersHand[i][2]
            }
    
            this.dealersHandValue = newScore
        }

        return foundFirstA;
    }

    getCard(isPlayer){
        let currentPlayer = isPlayer
        let suite = deck[0][Math.floor(Math.random() * deck[0].length)] 
        let [value, points] = deck[1][Math.floor(Math.random() * deck[1].length)]
        let displacement = `${(Math.random() * 10) - 5}deg`
        let card = [value+suite, displacement, points]

        if(this.cardsInPlay.includes(card[0])){
            this.getCard(currentPlayer)
        } else {
            if(isPlayer){
                this.playersHand = [...this.playersHand, card]
                this.cardsInPlay.push(card[0])
                this.playersHandValue += points
                if(this.playersHandValue > 21){
                    let foundAnA = this.checkForA(true)
                    if(foundAnA){
                    } else {
                        this.dealersGo()
                    }
                }
            } else {
                this.dealersHand = [...this.dealersHand, card]
                this.dealersHandValue += points
                this.cardsInPlay.push(card[0])
            }
        }

    }

    dealersGo =()=>{
        if(this.gameState.stay != true){
            this.gameState = changeGameState('stay')
            this.revealFaceDown()
        }


        if(this.playersHandValue > 21){
            this.isWinner = "Lose"
        } else {
            while(this.dealersHandValue < 17){
                this.getCard(false)
            }
            if(this.dealersHandValue > 21){
                let foundAnA = this.checkForA(false)
                    if(foundAnA){
                        this.dealersGo()
                    }else {
                        this.isWinner = "Win"
                    }
            } else {
                if(this.dealersHandValue === this.playersHandValue){
                    this.isWinner = "Push"
                } else { 
                    this.dealersHandValue > this.playersHandValue ? 
                        this.isWinner = "Lose" :
                        this.isWinner = "Win"
                }
            }
        }
        setTimeout(()=>{
            this.gameState = changeGameState('end')
            if(this.isWinner === "Win"){
                this.playerMoney += this.betAmount * 2
                this.betAmount = 0
            } else if(this.isWinner === "Push"){
                this.playerMoney += this.betAmount
                this.betAmount = 0
            } else {
                this.betAmount = 0
                if(this.playerMoney === 0 && this.betAmount === 0){
                }
            }

        }, 900)
        setTimeout(()=>{
            this.gameState = changeGameState('pay')
            this.updateGameState()
            this.restart()
        }, 2400)
    }

    revealFaceDown(){
        this.getCard(false)
        this.dealersHand[0] = this.dealersHand[this.dealersHand.length - 1]
        this.dealersHand.pop()
    }
    

    render(){
        return html
        `
        ${(this.gameState.start && this.betAmount > 0) ? html`<div class="btn deal" @click="${this.start}">Deal</div>` : ''}

        ${this.gameState.play ? html
            `<div class="hit btn" @click="${()=>this.getCard(true)}">Hit</div>
            <div class="stay btn" @click="${this.dealersGo}">Stay</div>` : ''
        }

        ${this.gameState.end ? 
            html`<win-banner class="banner" value=${this.isWinner}/>`
            : ""
        }

        <player-score
            value=${this.dealersHandValue}
            player="dealer"
        ></player-score>

        <div class="dealer">
            ${this.dealersHand.map(card => html`
                <game-cards
                    class="card"
                    value=${card[0]}
                    displacement=${card[1]}
                />
                `)}
        </div>

        <player-score
            value=${this.playersHandValue}
            player="player"
        ></player-score>

        <div class="player">
            ${this.playersHand.map(card => html`
                <game-cards 
                    class="card"
                    value=${card[0]}
                    displacement=${card[1]}
                />
                `)}
        </div>
        
        <chip-table playerMoney=${this.playerMoney} betAmount=${this.betAmount}></chip-table>

        ${this.gameState.bust ? html`<div class="game-over btn" @click="${this.gameOver}">Restart</div>` : ''}
        
        `
    }
}

// [["8H", "0deg"], ["9h", "1deg"], ["8S", "-2deg"]]
customElements.define('script-js', scriptJS)