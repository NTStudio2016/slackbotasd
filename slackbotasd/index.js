const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-946011727382-931097051394-mONA9DPVUJjbLGdAT6jzQR7M',
  name: 'bot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:'
  };

  bot.postMessageToChannel('general', 'A Bot rendszer betöltve és használatra készen áll!', params);
});

//ERROR Handler
bot.on('error', (err) => console.log(err));

//Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message'){
        return;
    }

    handleMessage(data.text, data.username);
});

//respond to data
function handleMessage(message, username){
    //respond to shopping list command
    if(message.includes(' bevásárlólista')){
        let darabok = message.split(" ");
        //respond to add command
        if(darabok[2] === 'hozzáad'){
            //chenck if there  are items to add
            if(darabok.length > 3){
                let kuldeni = [];
                for (let i = 3; i < darabok.length; i++) {
                    kuldeni.push(darabok[i]);
                }
                AddToShoppingList(kuldeni);
            }
            else{
                const params = {
                    icon_emoji: ':face_with_rolling_eyes:'
                };
                bot.postMessageToChannel('general', `Nem adtál meg elemet a hozzáadáshoz!`, params);
            }
        }
        //respond to chenck command
        else if(darabok[2] === 'megnéz'){
            ShoppingListView();
        }
        //respond to reove command
        else if(darabok[2] === 'töröl'){
            //check if there are items to delete
            if(darabok.length > 3){
                //check if shopping list   is empty ot not
                if(bevasarlolista.length !== 0){
                    let kuldeni = [];
                    for (let i = 3; i < darabok.length; i++) {
                        kuldeni.push(darabok[i]);
                    }
                    DeleteFromShoppingList(kuldeni);
                }
                else{
                    const params = {
                        icon_emoji: ':face_with_rolling_eyes:'
                    };
                    bot.postMessageToChannel('general', `A bevásárlólistának nincsenek elemei!`, params);
                }
            }
            else{
                const params = {
                    icon_emoji: ':face_with_rolling_eyes:'
                };
                bot.postMessageToChannel('general', `Nem adtál meg elemet a törléshez!`, params);
            }
        }
        else{
            const params = {
                icon_emoji: ':face_with_rolling_eyes:'
            };
            bot.postMessageToChannel('general', `A bevásárlólistának nincs ilyen parancsa: ${darabok[2]}`, params);
        }
    }
    //respandto help  command
    else if(message.includes(' segítség')){
        Help();
    }
    else if(username !== 'bot'){
        bot.getUserId('bot').then(res => {
            let user = res;
            if(message.startsWith("<@" + user + ">")){
                const params = {
                    icon_emoji: ':interrobang:'
                };
                let darabok = message.split(" ");
                bot.postMessageToChannel('general', `Ennek a Botnak nincs ilyen parancsa: ${darabok[1]}`, params);
            }
        })
        
    }
}

let bevasarlolista = [];

//add to shopping list
function AddToShoppingList(targyak = []){
    for(let i = 0; i < targyak.length; i++){
        bevasarlolista.push(targyak[i]);
    }
    const params = {
        icon_emoji: ':shopping_bags:'
    };
    bot.postMessageToChannel('general', `A bevásárló lista hossza: ${bevasarlolista.length}`, params);
}

//checklist
function ShoppingListView(){
    if(bevasarlolista.length !== 0){
        const params = {
            icon_emoji: ':shopping_trolley:'
        };
    
        let kimeno = 'A bevásárlólistának tartalma: ';
        for (let i = 0; i < bevasarlolista.length; i++) {
            kimeno += bevasarlolista[i] + ', ';
        }
        bot.postMessageToChannel('general', kimeno, params);
    }
    else{
        const params = {
            icon_emoji: ':face_with_rolling_eyes:'
        };
        bot.postMessageToChannel('general', `A bevásárlólistának nincsenek elemei`, params);
    }
}

//remove item  from list
function DeleteFromShoppingList(torolnivalok = []){
    let tempList = []
    let torolt = 0;
    for(let i = 0; i < bevasarlolista.length; i++){
        for(let j = 0; j < torolnivalok.length; j++){
            if(bevasarlolista[i] !== torolnivalok[j]){
                tempList.push(bevasarlolista[i]);
            }
            else{
                torolt++;
            }
        }
    }
    bevasarlolista = [];
    bevasarlolista = tempList;
    const params = {
        icon_emoji: ':negative_squared_cross_mark:'
    };
    bot.postMessageToChannel('general', `A bevásárló listáról törölve lett: ${torolt} elem`, params);
}

//help  function
function Help(){
    const params = {
        icon_emoji: ':information_source:'
    };
    let szokozok = "----";
    bot.postMessageToChannel('general', `A @Bot jelenleg elérhető parancsai: `, params).then((data) => {
        console.log("1");
        bot.postMessageToChannel('general', `${szokozok}Bevásárlólista: `, params).then((data) => {
            console.log("2");
            bot.postMessageToChannel('general', `${szokozok}${szokozok}hozzáad *tárgyak listája szóközzel elválasztva*`, params).then((data) => {
                console.log("3");
                bot.postMessageToChannel('general', `${szokozok}${szokozok}törlés *tárgyak listája szóközzel elválasztva*`, params).then((data) => {
                    console.log("4");
                    bot.postMessageToChannel('general', `${szokozok}${szokozok}megnézés`, params);
                    console.log("5");
                });
            });
        });
    });
}