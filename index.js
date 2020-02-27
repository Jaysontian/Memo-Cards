
const deck = {
  render: () => {
    $('.decks').empty();
    (data.decks).forEach((doc, i) => {
      var con = $('<div>').attr({'class':'deck-con','id':'deck'+i}).appendTo('.decks').click(()=>{card.render(i)});
      $('<p>').text(doc.name).appendTo(con);
    })
  },
  new: () => {
    var newdeck = {
      name:'Untitled Deck',
      description:'Give this deck a description.',
      cards: []
    };
    data.decks.push(newdeck);
    deck.render();
  }
}

const card = {
  render: (id) => {
    $('.cards').empty();
    selected = id;
    $('<h1>').text(data.decks[id].name).appendTo('.cards');
    $('<button>').text('Review').appendTo('.cards').click(()=>{review.deck(id)});
    $('<button>').text('Add Terms').appendTo('.cards').click(()=>{card.newterm(id)});
    (data.decks[id].cards).forEach((doc, i)=>{
      var con = $('<div>').attr({'class':'card-con','id':'card'+i}).appendTo('.cards');
      $('<h4>').text(doc.title).appendTo(con);
      var retention = Math.round(doc.remembered / (doc.remembered + doc.forgot)*100)
      $('<p>').text(retention + '%').appendTo(con);
    })
  },
  newterm: (id) => {
    var con = $('<div>').addClass('page').appendTo('body');
    $('<p>').text('Adding new term to '+ data.decks[id].name).appendTo(con);
    var term = $('<input>').attr('placeholder','Term').appendTo(con).focus(); $('<br>').appendTo(con);
    var def = $('<textarea>').attr({'rows':'4','placeholder':'Definition'}).appendTo(con); $('<br>').appendTo(con);
    $('<button>').text('Cancel').appendTo(con).click(()=>{con.remove()});
    $('<button>').text('Submit').appendTo(con).click(()=>{
      var tempterm = {
        type: 'term',
        title: term.val(),
        content: def.val(),
        created: new Date(),
        next: new Date(),
        remembered: 0,
        forgot: 0,
        interval: 1,
      };
      data.decks[selected].cards.push(tempterm);
      term.val(''); def.val(''); card.render(id); refresh();
      help.notify('You added a term to the deck.');
    });
  }
};

const review = {
  deck: (id) => {
    var con = $('<div>').addClass('page').appendTo('body');
    $('<button>').text('Quit').appendTo(con).click(()=>{con.remove()})
    $('<div>').html("<span id='card-index'>0</span>/<span id='card-total'>0</span>").appendTo(con);
    $('#card-total').text(data.decks[id].cards.length);
    $('<div>').attr('id','review-con').appendTo(con);
    review.loop(id, 0);
  },
  loop: (id, i) => {
    $('#review-con').empty();card.render(id);
    var doc = data.decks[id].cards[i];
    if (i >= data.decks[id].cards.length){
      $('.page').remove(); help.notify('You studied all the cards in the deck.');
    } else {
    $('#card-index').text(i+1);
    if (doc.type == 'term'){
      var con = $('<div>').addClass('card').appendTo('#review-con');
      $('<h3>').text(doc.title).appendTo(con);
      var def = $('<p>').attr('id','def').text(doc.content).appendTo(con).toggle();
      con.click(()=>{def.toggle()});
    }
    $('<button>').text('Remembered').appendTo('#review-con').click(()=>{
        doc.remembered ++;
        review.loop(id, i+1);
    })
    $('<button>').text('Forgot').appendTo('#review-con').click(()=>{
        doc.forgot ++;
        review.loop(id, i+1);
    })
  }}
}

const learn = {
  check: () => {
    var count = 0;
    data.due = [];
    (data.decks).forEach((deck, deckid)=>{
      deck.cards.forEach((card, cardid)=>{
        if(help.getdate(card.next) == help.getdate(new Date())){
          count++;
          (data.due).push([deckid, cardid])
        }
      })
    })
    $('#today-count').text(count);
  },
  init: () => {
    var con = $('<div>').addClass('page').appendTo('body');
    $('<button>').text('Back').appendTo(con).click(()=>{con.remove()})
    $('<div>').html("<span id='card-index'>0</span>/<span id='card-total'>0</span>").appendTo(con);
    $('#card-total').text(data.due.length);
    $('<div>').attr('id','learn-con').appendTo(con);
    learn.loop(0);
  },
  loop: (i) => {
    $('#learn-con').empty();
    if (i >= data.due.length){
      $('.page').remove(); help.notify('You have reviewed all your cards for today.');
    } else {
    var deckindex = data.due[i][0];
    var cardindex = data.due[i][1];
    var doc = data.decks[deckindex].cards[cardindex];
    $('#card-index').text(i+1);
    if (doc.type == 'term'){
      var con = $('<div>').addClass('card').appendTo('#learn-con');
      $('<h3>').text(doc.title).appendTo(con);
      var def = $('<p>').attr('id','def').text(doc.content).appendTo(con).toggle();
      con.click(()=>{def.toggle()});
    }
    $('<button>').text('Remembered').appendTo('#learn-con').click(()=>{
      doc.next = (doc.next).addDays(doc.interval);
      doc.interval *= data.cog.multiplier.up;
      learn.loop(i+1); learn.check();
    })
    $('<button>').text('Forgot').appendTo('#learn-con').click(()=>{
      doc.next = (doc.next).addDays(doc.interval);
      doc.interval *= data.cog.multiplier.down;
      learn.loop(i+1); learn.check();
    })
    }
  },

}

function refresh(){
  learn.check();
  deck.render();
}

refresh();
