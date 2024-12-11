import {LitElement, html, css} from 'lit'

export class gameCards extends LitElement{

    static properties = {
        value: {type: String},
        displacement: {type: String}
    }

    static styles = css
    `
        
        .card-outline{
            width: 100px;
            aspect-ratio: 9/14;
            overflow: hidden;
            position: relative;
            animation: moveCard 1s ease-out forwards;
        }

        @keyframes moveCard{
        
            0%{
                transform: translate(50%, -200%) rotate(45deg);
                overflow: hidden;
            }
            50%{
                }
            100%{
                transform: rotate(var(--displacement));
                }
        
        }
    `

    constructor(){
        super()
        this.value = ""
        this.displacement = "0"
    }

    updated(changedProperties){
        super.updated(changedProperties)

        this.style.setProperty('--displacement', this.displacement)
    }

    render(){
        return html
        `   
            <img class="card-outline" src="https://deckofcardsapi.com/static/img/${this.value}.png">
        `
    }
}

/*
 * Link to get the back of the cards
 * https://deckofcardsapi.com/static/img/back.png
 */ 
customElements.define('game-cards', gameCards)