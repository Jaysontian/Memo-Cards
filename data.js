var data = {
  user:'Jayson Tian',
  userId: 98123200,
  due:[],
  cog: {
    interval: 1,
    multiplier:{
      down:0.5,
      up:2,
    }
  },
  decks: [
    {
      name: 'Tutorial',
      description: 'Learn more about memocards.',
      date: 12938292,
      cards: [
        {
          type: 'term',
          title: 'Spaced Repetition',
          content: 'Method of active memory recall with increased time intervals.',
          created: new Date(),
          next:new Date(),
          remembered: 0,
          forgot: 0,
          interval: 1,
        },
        {
          type: 'term',
          title: 'Constapation',
          content: 'Some disease that makes it hard to uh.',
          created: new Date(),
          next:new Date(),
          remembered: 0,
          forgot: 0,
          interval: 1,
        }
      ]
    }
  ]
}
