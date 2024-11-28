let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let winner = 0;


$(document).ready(function() {
    initCards();
    initButtons();
    
});
function initCards(){
    $('.card span').empty(); 

    $('.card div').html('<img src="BACK.png"/>');
    

}
function initButtons(){
    $('#button-start').click(evt => {
        newGame()});
    $('#button-hit').click(evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    })
    $('#button-stand').click(evt => {
        evt.preventDefault();

        dealerRound();
    })
};

function buildDeck(){
    let deck=[];
    for(let suit = 1; suit <= 4; suit++){
        for(let num=1; num <= 13; num++){
            let c = new Card(suit, num);
            deck.push(c);
        }
    }
    return deck;
}


function newGame() {
   resetGame();
 
   deck = shuffle(buildDeck());
   
   yourDeck.push(deal());
   dealerDeck.push(deal());
   yourDeck.push(deal());
   inGame = true;
   //玩家在按下new game時馬上拿到21點時馬上判斷winner為1遊戲結束
   if(yourPoint === 21){
    winner = 1;
    inGame = false;
   }
   renderGameTable();

}



function deal(){
    return deck.shift();
}
//SHOW HANDS

function renderGameTable(){
//顯示牌卡
    yourDeck.forEach((card, i) => {
        let theCard = $(`#yourCard${i + 1}`);
        theCard.html(card.cardNumber());
        //cardNumber()要加()是因為他是一個函式
        theCard.prev().html(card.cardSuit());
        //.prev()是用來拿取前一個元素的，這裡指的是id為yourcardi這個div前面的span
    });

    dealerDeck.forEach((card, i) => {
        let theCard = $(`#dealerCard${i + 1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());
    });

//算點數
    yourPoint = calcPoint(yourDeck)
    $('#your-sum').html(yourPoint+'點');

    dealerPoint = calcPoint(dealerDeck)
    $('#dealer-sum').html(dealerPoint+'點');

    if (yourPoint>=21 || dealerPoint>=21){
        inGame = false
    };
//按鈕
    if (inGame) {
        $('#button-hit').attr('disabled', false);
        $('#button-stand').attr('disabled', false);

    } else {
        $('#button-hit').attr('disabled', true);
        $('#button-stand').attr('disabled', true);

    }
    //此if else可寫成$('#button-hit').attr('disabled', !inGame);就可以
    //意思是非inGame時呈現disabled狀態
    checkWhosWinner();
    showWin();
   }

function calcPoint(deck){
    let point = 0;
    let aceCount = 0;
    deck.forEach(card => {
        point += card.cardPoint();
        if(card.cardNumber() === 'A'){
            aceCount++;
        }
    });
    while (point > 21 && aceCount > 0){
        point -= 10;
        aceCount--;
    }
    return point;
}


function resetGame(){
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    initCards();   
    winner = 0; 
    $('.your-cards').removeClass('win');
    $('.dealer-cards').removeClass('win');
   

}


 function dealerRound() {
     // 宣告一個變數來跟蹤目前牌的數量
    let dealerCardIndex = dealerDeck.length;
    
    function dealerTurn() {
        dealerPoint = calcPoint(dealerDeck);  // 計算莊家的總點數
    
        // 如果莊家的點數小於等於玩家的點數，莊家繼續拿牌
        if (dealerPoint <= yourPoint ) {
            // 等待一段時間，讓莊家翻開一張牌
            setTimeout(() => {
                dealerDeck.push(deal()); // 發一張牌給莊家
                renderGameTable(); // 更新畫面顯示
                dealerCardIndex++; // 增加已顯示的牌的數量
                dealerTurn(); // 繼續進行下一輪
            }, 1000); // 每次顯示間隔 1000ms (1秒)，你可以根據需求調整這個時間
        } else {
            // 如果莊家不再拿牌，結束這一回合
            inGame = false;
            renderGameTable();
        }
    }dealerTurn();
}    
function checkWhosWinner(){
    //讓inGame=false後再判斷，防止一開始莊家點數就大於玩家點數時的判斷
    if(inGame === false){
        switch(true){case yourDeck.length === 5 && yourPoint<21:
                winner = 1;
                break;
            case yourPoint == 21:
                winner = 1;
                break; 
            case dealerPoint > 21:
                winner = 1;
                break;
            case yourPoint > 21:
                winner = 2;
                break;
            
            case yourPoint < dealerPoint:
                winner = 2;
                break;
        
            case yourPoint = dealerPoint:
                winner = 3;
                break;
            
            default:
                winner = 0;
                break;
        }
    }
}
function showWin(){
    switch(winner){
        case 1:
            $('.your-cards').addClass('win');
            break;
        case 2:
            $('.dealer-cards').addClass('win');
            break;
        case 3:
        default:
            break;
}
}
//網路來的shuffle
function shuffle(array) {
    let currentIndex = array.length;  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
      
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
class Card {
    constructor(suit, num){
        this.suit=suit;
        this.num=num;
    }
    //顯示數字
    cardNumber(){
        switch(this.num){
            case 1:
                return'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.num;
        }
    
    }
    //點數
    cardPoint(){
        switch(this.num){
            case 1 :
                return 11;
            case 11 :
            case 12 :
            case 13 :
                return 10;
            default :
                return this.num;
            }
        };
        //花色
    cardSuit(){
        switch(this.suit){
            case 1:
                return '♠';
            case 2:
                return '♥';
            case 3:
                return '♣';
            case 4:
                return '♦';    
        }
    }
}   