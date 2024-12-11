import {LitElement, html, css} from 'lit'

import changeGameState from './changeGameState'

export class chipTable extends LitElement{

    static properties = {
        value: {type: String},
        betAmount: {type: Number},
        betList: {type: Array},
        playerMoney: {type: Number},
        gameChipsArr: {type: Array},
        gameState: {type: Object}
    }

    static styles = css
    `
        :host{
            --prim-color: #123651;
        }

        .bank{
            padding: 10px;
            width: 95vw;
            max-width: 500px;
            position: fixed;
            bottom: 0;
        }

        .playersMoney{
            background-color: var(--prim-color);
            color: white;
            width: fit-content;
            padding: 3px 10px;
            border-radius: 5px 5px 0 0;
            z-index: 99;
            border: 1px dashed gray;
            border-bottom: none;
            position: relative;
            top: 1.4px;
        }

        .players-money-bottom-border{
            border-bottom: 1px dashed gray;
            border-radius: 5px;
        }

        .all-in{
            color: white;
            width: fit-content;
            padding: 3px 10px;
            border-radius: 5px 5px 0 0;
            border: 1px solid white;
            z-index: -1;
            position: absolute;
            right: 9.8px;
            top: 11.5px;
            background-color: var(--prim-color);
        }

        .all-in:hover{
            cursor: pointer;
            background: white;
            color: var(--prim-color);
        }

        
        .all-chips{
            background-color: var(--prim-color);
            border: dashed 1px gray;
        }

        .chips{
            background-color: var(--prim-color);
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: 10px;
        }

        .chip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            aspect-ratio: 1/1;
            border-radius: 50%;
            border: 2px dashed white;
            margin: auto;
            color: white;
            background-color: black;
            font-weight: 700;
        }

        .chip:hover{
            cursor: pointer;
            background-color: rgb(15, 15, 15);
        }

        .bet{
            position: absolute;
            top: 50%;
            left: 15%;
            transform: translate(-50%, -50%);
        }

        .bet-outline{
            background-color: rgba(0,0,0, 0);
        }

        .out{
            background-color: gray;
            opacity: 0;
        }

        .out:hover{
            cursor: unset;
            background-color: gray;
        }

        .bet-amount{
            background-color: rgba(1, 1, 1, 0.2);
            padding: 5px 10px;
            border-radius: 15px;
            position: absolute;
            top: 60%;
            left: 15%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: -1;
        }

        .bet-text{
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            margin: 0 auto;
            width: fit-content;
            z-index: -1;
        }

        .hidden{
            display: none;
        }

        .full-border{
            border: 1px dashed gray;
        }

        .restart{
            width: 120px;
            position: absolute;
            padding: 15px 25px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
    }

        .btn:hover{
            box-shadow: none;
            cursor: pointer;
        }

         @media(max-width: 1400px){
            .bet{top:40%}   
            .bet-amount{top:50% }
        }
    `

    constructor(){
        super()
        this.value = ""
        this.betAmount = 0
        this.betList = []
        this.playerMoney = 0
        this.gameChipsArr = [[1, 5, 10, 25, 50], [100, 500, 1000, 2500, 5000]]
        this.gameState = this.gameState = {
            start: true,
            bid: false,
            deal: false,
            play: false,
            stay: false,
            end: false,
            pay: false,
            bust: false
        }
        this.updateGameState()
    }

    updateGameState(){
        this.requestUpdate()
    }

    start(){
        this.betList = []
        this.gameState = changeGameState('start')
        this.requestUpdate()
    }

    addBet =(bet)=>{
        this.betAmount += bet
        this.playerMoney -= bet
        this.betList.push(bet)
        this.handleMoneyChanges()
    }

    allIn(){
        for(let i = this.gameChipsArr.length - 1; i >= 0; i--){
            for(let j = this.gameChipsArr.length - 1; j >= 0; j--){
                while(this.playerMoney >= this.gameChipsArr[i][j]){
                    this.addBet(this.gameChipsArr[i][j])
                }
            }
        }
    }

    removeBet =()=>{
        let bet = this.betList[this.betList.length - 1]
        this.playerMoney += bet
        this.betAmount -= bet
        this.betList.pop()
        this.handleMoneyChanges()
        this.update()
    }

    handleMoneyChanges =()=>{
        this.dispatchEvent(new CustomEvent('bet-changed',{
            detail: {betAmount: this.betAmount, playerMoney: this.playerMoney},
            bubbles: true,
            composed: true
        }))
    }



    render(){
        return html
        `
        <div class="bank">
            <div class="playersMoney ${!this.gameState.start ? "players-money-bottom-border" : ""}">Bank: $${this.playerMoney}</div>
            <div class="all-in ${!this.gameState.start && "hidden"}" @click="${this.allIn}">All In</div>
            <div class="all-chips ${!this.gameState.start && "hidden"}">
                <div class="chips">
                    ${this.gameChipsArr[0] && this.gameChipsArr[0].map(chip => chip <= this.playerMoney ? html `
                        <div class="chip" @click="${this.gameState.start ? ()=>this.addBet(chip) : null}">${chip}</div>
                        ` : html `<div class="chip out"}">${chip}</div>`
                    )}
                </div>
                <div class="chips">
                    ${this.gameChipsArr[1] &&  this.gameChipsArr[1].map(chip => chip <= this.playerMoney ? html `
                        <div class="chip" @click="${this.gameState.start ? ()=>this.addBet(chip) : null}">${chip}</div>
                        ` : html `<div class="chip out"}">${chip}</div>`
                    )}
                </div>
            </div>
        </div>

        <div class="bet" @click="${this.gameState.start ? this.removeBet : null}">
            ${!this.gameState.pay ? this.betList != null && this.betList.length > 0 ? html`<div class="chip">${this.betList[this.betList.length - 1]} </div>`:"" : ""}
        </div>   
       
        
        <div class="bet-amount">
            <div class="bet-text">
                <p>Current Bet:</p> 
                <p>$${this.betAmount}</p>
            </div>
        </div>

        ${this.gameState.pay ? html`<div class="restart btn" @click="${this.start}">Play Again</div>` : ''}

        `
    }
}

customElements.define('chip-table', chipTable)