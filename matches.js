const matchesData = [
  {
    id:"13.04 Haugesund hjemme",
    date:"2026-04-13",
    home:"Lyn",
    away:"Haugesund",
    deadline:"2026-04-13T18:00:00",
    actual:null
  },
  {
    id:"21.04 Sogndal borte",
    date:"2026-04-21",
    home:"Sogndal",
    away:"Lyn",
    deadline:"2026-04-21T18:00:00",
    actual:null
  },
  {
    id:"27.04 Sandnes Ulf hjemme",
    date:"2026-04-27",
    home:"Lyn",
    away:"Sandnes Ulf",
    deadline:"2026-04-27T18:00:00",
    actual:null
  },
  {
    id:"30.04 Moss borte",
    date:"2026-04-30",
    home:"Moss",
    away:"Lyn",
    deadline:"2026-04-30T18:00:00",
    actual:null
  },
  {
    id:"01.05 Lyn - Stabæk",
    date:"2026-05-01",
    home:"Lyn",
    away:"Stabæk",
    deadline:"2026-05-01T18:00:00",
    actual:{ home:0, away:4 }
  },
  {
    id:"10.05 Raufoss - Lyn",
    date:"2026-05-10",
    home:"Raufoss",
    away:"Lyn",
    deadline:"2026-05-10T18:00:00",
    actual:null
  },
  {
    id:"16.05 Lyn - Kongsvinger",
    date:"2026-05-16",
    home:"Lyn",
    away:"Kongsvinger",
    deadline:"2026-05-16T18:00:00",
    actual:null
  },
  {
    id:"20.05 Egersund - Lyn",
    date:"2026-05-20",
    home:"Egersund",
    away:"Lyn",
    deadline:"2026-05-20T18:00:00",
    actual:null
  },
  {
    id:"25.05 Lyn - Strømmen",
    date:"2026-05-25",
    home:"Lyn",
    away:"Strømmen",
    deadline:"2026-05-25T18:00:00",
    actual:null
  },
  {
    id:"31.05 Odd - Lyn",
    date:"2026-05-31",
    home:"Odd",
    away:"Lyn",
    deadline:"2026-05-31T18:00:00",
    actual:null
  },
  {
    id:"14.06 Lyn - Bryne",
    date:"2026-06-14",
    home:"Lyn",
    away:"Bryne",
    deadline:"2026-06-14T18:00:00",
    actual:null
  },
  {
    id:"19.06 Ranheim - Lyn",
    date:"2026-06-19",
    home:"Ranheim",
    away:"Lyn",
    deadline:"2026-06-19T18:00:00",
    actual:null
  },
  {
    id:"27.06 Lyn - Hødd",
    date:"2026-06-27",
    home:"Lyn",
    away:"Hødd",
    deadline:"2026-06-27T18:00:00",
    actual:null
  },
  {
    id:"02.07 Lyn - Åsane",
    date:"2026-07-02",
    home:"Lyn",
    away:"Åsane",
    deadline:"2026-07-02T18:00:00",
    actual:null
  },
  {
    id:"26.07 Strømsgodset - Lyn",
    date:"2026-07-26",
    home:"Strømsgodset",
    away:"Lyn",
    deadline:"2026-07-26T18:00:00",
    actual:null
  },
  {
    id:"02.08 Lyn - Sogndal",
    date:"2026-08-02",
    home:"Lyn",
    away:"Sogndal",
    deadline:"2026-08-02T18:00:00",
    actual:null
  },
  {
    id:"09.08 Stabæk - Lyn",
    date:"2026-08-09",
    home:"Stabæk",
    away:"Lyn",
    deadline:"2026-08-09T18:00:00",
    actual:null
  },
  {
    id:"16.08 Lyn - Odd",
    date:"2026-08-16",
    home:"Lyn",
    away:"Odd",
    deadline:"2026-08-16T18:00:00",
    actual:null
  },
  {
    id:"26.08 Åsane - Lyn",
    date:"2026-08-26",
    home:"Åsane",
    away:"Lyn",
    deadline:"2026-08-26T18:00:00",
    actual:null
  },
  {
    id:"30.08 Kongsvinger - Lyn",
    date:"2026-08-30",
    home:"Kongsvinger",
    away:"Lyn",
    deadline:"2026-08-30T18:00:00",
    actual:null
  },
  {
    id:"06.09 Lyn - Egersund",
    date:"2026-09-06",
    home:"Lyn",
    away:"Egersund",
    deadline:"2026-09-06T18:00:00",
    actual:null
  },
  {
    id:"13.09 Hødd - Lyn",
    date:"2026-09-13",
    home:"Hødd",
    away:"Lyn",
    deadline:"2026-09-13T18:00:00",
    actual:null
  },
  {
    id:"20.09 Lyn - Ranheim",
    date:"2026-09-20",
    home:"Lyn",
    away:"Ranheim",
    deadline:"2026-09-20T18:00:00",
    actual:null
  },
  {
    id:"04.10 Bryne - Lyn",
    date:"2026-10-04",
    home:"Bryne",
    away:"Lyn",
    deadline:"2026-10-04T18:00:00",
    actual:null
  },
  {
    id:"11.10 Lyn - Strømsgodset",
    date:"2026-10-11",
    home:"Lyn",
    away:"Strømsgodset",
    deadline:"2026-10-11T18:00:00",
    actual:null
  },
  {
    id:"14.10 Haugesund - Lyn",
    date:"2026-10-14",
    home:"Haugesund",
    away:"Lyn",
    deadline:"2026-10-14T18:00:00",
    actual:null
  },
  {
    id:"18.10 Lyn - Moss",
    date:"2026-10-18",
    home:"Lyn",
    away:"Moss",
    deadline:"2026-10-18T18:00:00",
    actual:null
  },
  {
    id:"25.10 Sandnes Ulf - Lyn",
    date:"2026-10-25",
    home:"Sandnes Ulf",
    away:"Lyn",
    deadline:"2026-10-25T18:00:00",
    actual:null
  },
  {
    id:"01.11 Lyn - Raufoss",
    date:"2026-11-01",
    home:"Lyn",
    away:"Raufoss",
    deadline:"2026-11-01T18:00:00",
    actual:null
  },
  {
    id:"08.11 Strømmen - Lyn",
    date:"2026-11-08",
    home:"Strømmen",
    away:"Lyn",
    deadline:"2026-11-08T18:00:00",
    actual:null
  }
];
