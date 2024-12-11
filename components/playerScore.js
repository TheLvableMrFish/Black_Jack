import {LitElement, html, css} from 'lit'

export class playerScore extends LitElement{

    static properties = {
        value: {type: String},
        player: {type: String}
    }

    static styles = css
    `
    .points{
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        border-radius: 50%;
        padding: 18px;
        text-align: center;
        width: 20px;
        height: 20px;
        aspect-ratio: 1/1;
        font-weight: 700;
        z-index: 88;
        line-height: 1;
    }

    .dealer{
        top: 35%;
    }

    .player{
        top: 65%;
    }
 
    .score{
        color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

    }
    `

    constructor(){
        super()
        this.value = ""
        this.player = ""
    }

    render(){
        return html
        `   
            <div class="points ${this.player}">
                <span class="score">${this.value}</span>
            </div>
        `
    }
}

customElements.define('player-score', playerScore)