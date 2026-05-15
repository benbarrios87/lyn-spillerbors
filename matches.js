const matchesData = [
  {
    id:"13.04 Haugesund hjemme",
    team:"men",
    date:"2026-04-13",
    home:"Lyn",
    away:"Haugesund",
    deadline:"2026-04-13T18:00:00",
    actual:{ home:2, away:4 }
  },
  {
    id:"21.04 Sogndal borte",
    team:"men",
    date:"2026-04-21",
    home:"Sogndal",
    away:"Lyn",
    deadline:"2026-04-21T18:00:00",
    actual:{ home:0, away:3 }
  },
  {
    id:"27.04 Sandnes Ulf hjemme",
    team:"men",
    date:"2026-04-27",
    home:"Lyn",
    away:"Sandnes Ulf",
    deadline:"2026-04-27T18:00:00",
    actual:{ home:0, away:2 }
  },
  {
    id:"30.04 Moss borte",
    team:"men",
    date:"2026-04-30",
    home:"Moss",
    away:"Lyn",
    deadline:"2026-04-30T18:00:00",
    actual:{ home:2, away:1 }
  },
  {
    id:"01.05 Lyn - Stabæk",
    team:"men",
    date:"2026-05-01",
    home:"Lyn",
    away:"Stabæk",
    deadline:"2026-05-01T18:00:00",
    actual:{ home:0, away:4 }
  },
  {
    id:"10.05 Raufoss - Lyn",
    team:"men",
    date:"2026-05-10",
    home:"Raufoss",
    away:"Lyn",
    deadline:"2026-05-10T17:00:00",
    actual:{ home:0, away:1 }
  },
  {
    id:"16.05 Lyn - Kongsvinger",
    team:"men",
    date:"2026-05-16",
    home:"Lyn",
    away:"Kongsvinger",
    deadline:"2026-05-16T18:00:00",
    actual:null
  },
  {
    id:"20.05 Egersund - Lyn",
    team:"men",
    date:"2026-05-20",
    home:"Egersund",
    away:"Lyn",
    deadline:"2026-05-20T18:00:00",
    actual:null
  },
  {
    id:"25.05 Lyn - Strømmen",
    team:"men",
    date:"2026-05-25",
    home:"Lyn",
    away:"Strømmen",
    deadline:"2026-05-25T18:00:00",
    actual:null
  },
  {
    id:"31.05 Odd - Lyn",
    team:"men",
    date:"2026-05-31",
    home:"Odd",
    away:"Lyn",
    deadline:"2026-05-31T18:00:00",
    actual:null
  },
  {
    id:"14.06 Lyn - Bryne",
    team:"men",
    date:"2026-06-14",
    home:"Lyn",
    away:"Bryne",
    deadline:"2026-06-14T18:00:00",
    actual:null
  },
  {
    id:"19.06 Ranheim - Lyn",
    team:"men",
    date:"2026-06-19",
    home:"Ranheim",
    away:"Lyn",
    deadline:"2026-06-19T18:00:00",
    actual:null
  },
  {
    id:"27.06 Lyn - Hødd",
    team:"men",
    date:"2026-06-27",
    home:"Lyn",
    away:"Hødd",
    deadline:"2026-06-27T18:00:00",
    actual:null
  },
  {
    id:"02.07 Lyn - Åsane",
    team:"men",
    date:"2026-07-02",
    home:"Lyn",
    away:"Åsane",
    deadline:"2026-07-02T18:00:00",
    actual:null
  },
  {
    id:"26.07 Strømsgodset - Lyn",
    team:"men",
    date:"2026-07-26",
    home:"Strømsgodset",
    away:"Lyn",
    deadline:"2026-07-26T18:00:00",
    actual:null
  },
  {
    id:"02.08 Lyn - Sogndal",
    team:"men",
    date:"2026-08-02",
    home:"Lyn",
    away:"Sogndal",
    deadline:"2026-08-02T18:00:00",
    actual:null
  },
  {
    id:"09.08 Stabæk - Lyn",
    team:"men",
    date:"2026-08-09",
    home:"Stabæk",
    away:"Lyn",
    deadline:"2026-08-09T18:00:00",
    actual:null
  },
  {
    id:"16.08 Lyn - Odd",
    team:"men",
    date:"2026-08-16",
    home:"Lyn",
    away:"Odd",
    deadline:"2026-08-16T18:00:00",
    actual:null
  },
  {
    id:"26.08 Åsane - Lyn",
    team:"men",
    date:"2026-08-26",
    home:"Åsane",
    away:"Lyn",
    deadline:"2026-08-26T18:00:00",
    actual:null
  },
  {
    id:"30.08 Kongsvinger - Lyn",
    team:"men",
    date:"2026-08-30",
    home:"Kongsvinger",
    away:"Lyn",
    deadline:"2026-08-30T18:00:00",
    actual:null
  },
  {
    id:"06.09 Lyn - Egersund",
    team:"men",
    date:"2026-09-06",
    home:"Lyn",
    away:"Egersund",
    deadline:"2026-09-06T18:00:00",
    actual:null
  },
  {
    id:"13.09 Hødd - Lyn",
    team:"men",
    date:"2026-09-13",
    home:"Hødd",
    away:"Lyn",
    deadline:"2026-09-13T18:00:00",
    actual:null
  },
  {
    id:"20.09 Lyn - Ranheim",
    team:"men",
    date:"2026-09-20",
    home:"Lyn",
    away:"Ranheim",
    deadline:"2026-09-20T18:00:00",
    actual:null
  },
  {
    id:"04.10 Bryne - Lyn",
    team:"men",
    date:"2026-10-04",
    home:"Bryne",
    away:"Lyn",
    deadline:"2026-10-04T18:00:00",
    actual:null
  },
  {
    id:"11.10 Lyn - Strømsgodset",
    team:"men",
    date:"2026-10-11",
    home:"Lyn",
    away:"Strømsgodset",
    deadline:"2026-10-11T18:00:00",
    actual:null
  },
  {
    id:"14.10 Haugesund - Lyn",
    team:"men",
    date:"2026-10-14",
    home:"Haugesund",
    away:"Lyn",
    deadline:"2026-10-14T18:00:00",
    actual:null
  },
  {
    id:"18.10 Lyn - Moss",
    team:"men",
    date:"2026-10-18",
    home:"Lyn",
    away:"Moss",
    deadline:"2026-10-18T18:00:00",
    actual:null
  },
  {
    id:"25.10 Sandnes Ulf - Lyn",
    team:"men",
    date:"2026-10-25",
    home:"Sandnes Ulf",
    away:"Lyn",
    deadline:"2026-10-25T18:00:00",
    actual:null
  },
  {
    id:"01.11 Lyn - Raufoss",
    team:"men",
    date:"2026-11-01",
    home:"Lyn",
    away:"Raufoss",
    deadline:"2026-11-01T18:00:00",
    actual:null
  },
  {
    id:"08.11 Strømmen - Lyn",
    team:"men",
    date:"2026-11-08",
    home:"Strømmen",
    away:"Lyn",
    deadline:"2026-11-08T18:00:00",
    actual:null
  },

  {
    id:"15.05 Lyn kvinner - Røa",
    team:"women",
    date:"2026-05-15",
    home:"Lyn",
    away:"Røa Fotball Elite",
    deadline:"2026-05-15T18:00:00",
    actual:{ home:0, away:0 }
  },
  {
    id:"26.05 Brann kvinner - Lyn",
    team:"women",
    date:"2026-05-26",
    home:"SK Brann",
    away:"Lyn",
    deadline:"2026-05-26T18:00:00",
    actual:null
  },
  {
    id:"31.05 Lyn kvinner - Vålerenga",
    team:"women",
    date:"2026-05-31",
    home:"Lyn",
    away:"Vålerenga Fotball",
    deadline:"2026-05-31T14:30:00",
    actual:null
  },
  {
    id:"13.06 Lyn kvinner - Rosenborg",
    team:"women",
    date:"2026-06-13",
    home:"Lyn",
    away:"Rosenborg BK",
    deadline:"2026-06-13T13:30:00",
    actual:null
  },
  {
    id:"20.06 Hønefoss kvinner - Lyn",
    team:"women",
    date:"2026-06-20",
    home:"Hønefoss BK",
    away:"Lyn",
    deadline:"2026-06-20T14:30:00",
    actual:null
  },
  {
    id:"15.08 Lyn kvinner - AaFK Kvinner",
    team:"women",
    date:"2026-08-15",
    home:"Lyn",
    away:"AaFK Kvinner",
    deadline:"2026-08-15T15:00:00",
    actual:null
  },
  {
    id:"20.08 Rosenborg kvinner - Lyn",
    team:"women",
    date:"2026-08-20",
    home:"Rosenborg BK",
    away:"Lyn",
    deadline:"2026-08-20T18:00:00",
    actual:null
  },
  {
    id:"29.08 Røa - Lyn kvinner",
    team:"women",
    date:"2026-08-29",
    home:"Røa Fotball Elite",
    away:"Lyn",
    deadline:"2026-08-29T15:00:00",
    actual:null
  },
  {
    id:"12.09 Lyn kvinner - Brann",
    team:"women",
    date:"2026-09-12",
    home:"Lyn",
    away:"SK Brann",
    deadline:"2026-09-12T15:00:00",
    actual:null
  },
  {
    id:"19.09 LSK Kvinner - Lyn",
    team:"women",
    date:"2026-09-19",
    home:"LSK Kvinner",
    away:"Lyn",
    deadline:"2026-09-19T15:00:00",
    actual:null
  },
  {
    id:"26.09 Lyn kvinner - Hønefoss",
    team:"women",
    date:"2026-09-26",
    home:"Lyn",
    away:"Hønefoss BK",
    deadline:"2026-09-26T15:00:00",
    actual:null
  },
  {
    id:"03.10 Lyn kvinner - Haugesund",
    team:"women",
    date:"2026-10-03",
    home:"Lyn",
    away:"Haugesund",
    deadline:"2026-10-03T15:00:00",
    actual:null
  },
  {
    id:"17.10 Bodø Glimt kvinner - Lyn",
    team:"women",
    date:"2026-10-17",
    home:"Bodø/Glimt",
    away:"Lyn",
    deadline:"2026-10-17T15:00:00",
    actual:null
  },
  {
    id:"24.10 Lyn kvinner - Molde",
    team:"women",
    date:"2026-10-24",
    home:"Lyn",
    away:"Molde",
    deadline:"2026-10-24T15:00:00",
    actual:null
  },
  {
    id:"31.10 Vålerenga kvinner - Lyn",
    team:"women",
    date:"2026-10-31",
    home:"Vålerenga Fotball",
    away:"Lyn",
    deadline:"2026-10-31T15:00:00",
    actual:null
  },
  {
    id:"07.11 Lyn kvinner - Stabæk",
    team:"women",
    date:"2026-11-07",
    home:"Lyn",
    away:"Stabæk",
    deadline:"2026-11-07T15:00:00",
    actual:null
  }
];
