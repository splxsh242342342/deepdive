/* Prompt generator: builds extra "Name ..." prompts from hand-picked parts. No AI needed.
   Every list is curated and parts are only combined where every combination makes sense,
   so prompts stay family-friendly and answerable. Add entries to any list for more variety. */

const COLOURS = ['red', 'blue', 'green', 'yellow', 'white', 'black', 'orange', 'pink', 'brown', 'silver'];
// describing words paired only with places that hold lots of everyday things
const RICH = {
  'in a kitchen': [...COLOURS, 'round', 'sharp', 'heavy', 'tiny', 'shiny', 'metal', 'plastic', 'wooden', 'glass', 'hot', 'cold', 'noisy', 'sticky'],
  'in a bathroom': [...COLOURS, 'round', 'soft', 'tiny', 'shiny', 'plastic', 'glass', 'smelly', 'wet'],
  'in a bedroom': [...COLOURS, 'round', 'soft', 'heavy', 'tiny', 'shiny', 'plastic', 'wooden', 'fluffy', 'noisy'],
  'in a living room': [...COLOURS, 'round', 'soft', 'heavy', 'tiny', 'shiny', 'wooden', 'glass', 'noisy'],
  'in a garage': [...COLOURS, 'round', 'sharp', 'heavy', 'tiny', 'metal', 'plastic', 'wooden', 'noisy', 'dirty'],
  'in a garden': [...COLOURS, 'round', 'sharp', 'tiny', 'wooden', 'prickly', 'smelly', 'wet'],
  'in a classroom': [...COLOURS, 'round', 'sharp', 'heavy', 'tiny', 'plastic', 'wooden', 'noisy', 'sticky'],
  'in an office': [...COLOURS, 'round', 'sharp', 'heavy', 'tiny', 'metal', 'plastic', 'noisy'],
  'in a supermarket': [...COLOURS, 'round', 'heavy', 'tiny', 'frozen', 'crunchy', 'sweet', 'sour', 'smelly', 'cold'],
  'in a toy shop': [...COLOURS, 'round', 'soft', 'tiny', 'shiny', 'plastic', 'wooden', 'noisy', 'fluffy'],
  'in a hardware store': [...COLOURS, 'round', 'sharp', 'heavy', 'tiny', 'metal', 'plastic', 'wooden'],
  'in a clothes shop': [...COLOURS, 'soft', 'tiny', 'shiny', 'striped', 'woolly', 'stretchy'],
  'on a farm': [...COLOURS, 'round', 'heavy', 'tiny', 'noisy', 'smelly', 'wooden', 'fluffy'],
  'at the beach': [...COLOURS, 'round', 'sharp', 'soft', 'tiny', 'shiny', 'plastic', 'wet'],
  'in a forest': ['green', 'brown', 'red', 'yellow', 'round', 'sharp', 'tiny', 'tall', 'prickly', 'noisy', 'wet'],
  'in a park': [...COLOURS, 'round', 'tiny', 'tall', 'wooden', 'metal', 'noisy'],
  'at a market': [...COLOURS, 'round', 'heavy', 'tiny', 'shiny', 'sweet', 'smelly', 'wooden'],
  'in a toolbox': ['red', 'yellow', 'black', 'silver', 'sharp', 'heavy', 'tiny', 'metal', 'plastic'],
  'in a sweet shop': ['red', 'blue', 'green', 'yellow', 'white', 'pink', 'orange', 'brown', 'round', 'sour', 'chewy', 'tiny', 'sticky']
};
const PLACES = ['in a kitchen', 'in a bathroom', 'in a bedroom', 'in a living room', 'in a garage', 'in a shed', 'in an attic', 'in a basement',
  'in a classroom', 'in a library', 'in a supermarket', 'in a hospital', 'in an office', 'on a farm', 'in a barn', 'at the zoo', 'in an aquarium',
  'in a museum', 'at the cinema', 'in a bakery', 'in a restaurant', 'in a café', 'in a pharmacy', 'at an airport', 'at a train station', 'on a bus',
  'in a car', 'on a boat', 'at the beach', 'in a forest', 'in a jungle', 'in a desert', 'on a mountain', 'in a cave', 'in a river', 'in a pond',
  'in a park', 'in a playground', 'at a campsite', 'in a castle', 'at the circus', 'at a fairground', 'in a stadium', 'in a gym', 'at a swimming pool',
  'in a toy shop', 'in a hardware store', 'in a pet shop', 'in a garden centre', 'in a bookshop', 'in a sweet shop', 'in a clothes shop', 'in a laboratory',
  'in a workshop', 'in a fire station', 'on a space station', 'on a pirate ship', 'in a submarine', 'in a lighthouse', 'at a harbour', 'at a market',
  'in a hotel', 'in a tent', 'in a treehouse', 'in a greenhouse', 'in an art studio', 'in a music room', 'at the dentist', 'at the vet', 'at the hairdresser',
  'in a school bag', 'in a handbag', 'in a toolbox', 'in a lunchbox', 'in a fridge', 'in a freezer', 'in a wardrobe', 'in a junk drawer',
  'in a first aid kit', 'in a picnic basket', 'in a suitcase', 'in a pencil case', 'in a garden', 'in a post office', 'at a bank', 'in a church', 'at a wedding'];

const VERBS = ['eat raw', 'throw', 'fold', 'climb', 'ride', 'wear on your head', 'wear on your feet', 'wear on your hands', 'plant', 'bake', 'kick',
  'recycle', 'inflate', 'sharpen', 'peel', 'knit', 'juggle', 'freeze', 'melt', 'blow', 'squeeze', 'roll', 'pour', 'stack', 'tie', 'unlock',
  'hang on a wall', 'collect', 'grow in a pot', 'hear but not see', 'smell from far away', 'spread on toast', 'put in a sandwich', 'pop', 'build with',
  'dip in chocolate', 'fly', 'hide behind', 'sit on', 'sleep in', 'fill with water', 'cut with scissors', 'play in a band', 'buy at a petrol station', 'win at a fair'];

const HAS = ['has wheels', 'has a screen', 'has buttons', 'has legs', 'has wings', 'has a handle', 'has strings', 'has a lid', 'has teeth', 'has a tail',
  'has spots', 'has keys', 'has a zip', 'has a plug', 'has bristles', 'has a shell', 'has feathers', 'has petals', 'has a blade', 'has a battery',
  'flies', 'floats', 'glows in the dark', 'bounces', 'melts in the sun', 'smells nice', 'makes a loud noise', 'ticks', 'rings', 'buzzes', 'beeps',
  'comes in pairs', 'is hollow', 'is see-through', 'is slippery', 'is prickly', 'is bigger than a car', 'fits in a matchbox', 'lives underground',
  'lives in the sea', 'changes colour', 'is shaped like a ball', 'has a long neck', 'you plug in', 'needs batteries', 'is sold by the dozen', 'grows on trees'];

const FOOD = ['red', 'green', 'yellow', 'orange', 'purple', 'white', 'brown', 'crunchy', 'spicy', 'sweet', 'sour', 'salty', 'chewy', 'round', 'frozen',
  'fried', 'sticky', 'creamy', 'bitter', 'smelly'];
const MEALS = ['for breakfast', 'at a barbecue', 'at the cinema', 'at a birthday party', 'on a picnic', 'at Christmas', 'at a football match', 'in a lunchbox',
  'at an Italian restaurant', 'at a Chinese restaurant', 'at an Indian restaurant', 'at a Mexican restaurant', 'at a Japanese restaurant', 'at a bakery', 'at a fair'];

const ANIMAL = ['lives in the desert', 'can climb trees', 'has stripes', 'has spots', 'hops', 'lays eggs', 'eats insects', 'hibernates', 'lives in a herd',
  'comes out at night', 'has a shell', 'has horns', 'can swim', 'is smaller than a mouse', 'is bigger than a horse', 'lives in Africa', 'lives in Australia',
  'lives in the Arctic', 'lives in the rainforest', 'lives on a farm', 'lives in a river', 'lives in the deep sea', 'has a long tail', 'has a pouch',
  'has tusks', 'has fur', 'can fly', 'can\'t fly', 'is black and white', 'is green', 'is pink', 'has more than four legs', 'has no legs',
  'makes a good pet', 'lives in a hive', 'changes colour', 'is very slow', 'is very fast', 'lives in a burrow', 'builds a nest'];

const REGIONS = ['Europe', 'Asia', 'Africa', 'South America', 'North America', 'Oceania'];
const CITY_IN = ['France', 'Germany', 'Italy', 'Spain', 'Japan', 'China', 'India', 'Brazil', 'Canada', 'Australia', 'Mexico', 'the USA', 'the UK',
  'Ireland', 'Russia', 'Egypt', 'South Africa', 'Argentina', 'Turkey', 'Greece', 'Poland', 'Sweden', 'Norway', 'the Netherlands', 'Portugal',
  'South Korea', 'Thailand', 'Indonesia', 'Nigeria', 'New Zealand', 'Scotland', 'Switzerland', 'Austria', 'Belgium', 'Vietnam', 'Peru', 'Chile', 'Kenya', 'Morocco', 'Colombia'];

const JOBS = ['chef', 'farmer', 'doctor', 'pilot', 'plumber', 'teacher', 'astronaut', 'firefighter', 'gardener', 'carpenter', 'baker', 'vet', 'dentist',
  'artist', 'scientist', 'mechanic', 'photographer', 'musician', 'sailor', 'builder', 'zookeeper', 'librarian', 'hairdresser', 'lifeguard',
  'electrician', 'tailor', 'magician', 'detective', 'explorer', 'beekeeper', 'nurse', 'postman', 'referee', 'surgeon', 'waiter', 'fisherman',
  'painter', 'jockey', 'diver', 'archaeologist', 'florist', 'butcher', 'judge', 'pharmacist', 'clown', 'knight', 'pirate', 'wizard', 'cowboy', 'ballet dancer'];

const EVENTS = ['at a wedding', 'at a birthday party', 'at a sleepover', 'on a camping trip', 'at a picnic', 'at a music festival', 'at a sports day',
  'on a school trip', 'on a road trip', 'on a snow day', 'on a beach holiday', 'at a football match', 'at a Halloween party', 'at a New Year party',
  'at a garden party', 'at a talent show', 'on a long flight', 'on the first day of school', 'on a ski trip', 'at a farmers market'];

const SPORT = ['a ball', 'a bat', 'a racket', 'a stick', 'a net', 'a board', 'a horse', 'a boat', 'a bike', 'skates', 'a helmet', 'a team of eleven', 'a goal', 'a puck'];

const uniq = a => [...new Map(a.map(x => [x.q, x])).values()];
const art = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;

export function generatePrompts() { // -> [{ q: prompt, f: pattern }]
  const out = [], add = (f, ...qs) => qs.forEach(q => out.push({ q, f }));
  for (const p of PLACES) add('place', `Name something you'd find ${p}`);
  for (const [p, adjs] of Object.entries(RICH)) for (const a of adjs) add('place', `Name something ${a} you'd find ${p}`);
  for (const v of VERBS) add('verb', `Name something you can ${v}`);
  for (const h of HAS) add('has', `Name something that ${h}`);
  for (const f of FOOD) add('food', `Name a food that is ${f}`);
  for (const m of MEALS) add('food', `Name something you'd eat ${m}`);
  for (const a of ANIMAL) add('animal', `Name an animal that ${a}`);
  for (const r of REGIONS) add('geo', `Name a country in ${r}`, `Name a city in ${r}`, `Name a river in ${r}`, `Name a capital city in ${r}`, `Name a food from ${r}`);
  for (const c of CITY_IN) add('geo', `Name a city in ${c}`, `Name a food from ${c}`, `Name something ${c} is famous for`);
  for (const j of JOBS) add('job', `Name a tool ${art(j)} uses`, `Name something ${art(j)} wears`, `Name something ${art(j)} might say`);
  for (const e of EVENTS) add('event', `Name something you'd see ${e}`, `Name something you'd need ${e}`);
  for (const s of SPORT) add('sport', `Name a sport played with ${s}`);
  return uniq(out);
}
