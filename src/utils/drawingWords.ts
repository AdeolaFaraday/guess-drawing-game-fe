// Drawing words for the guessing game
// Organized by categories for easy selection and filtering

export const DRAWING_WORDS = {
  // Animals
  animals: [
    'cat', 'dog', 'bird', 'fish', 'rabbit', 'mouse', 'horse', 'cow', 'pig', 'sheep',
    'duck', 'chicken', 'frog', 'snake', 'turtle', 'butterfly', 'bee', 'spider',
    'elephant', 'lion', 'tiger', 'bear', 'monkey', 'giraffe', 'zebra', 'kangaroo',
    'panda', 'penguin', 'owl', 'eagle', 'shark', 'dolphin', 'whale', 'octopus'
  ],

  // Food & Drinks
  food: [
    'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'pineapple',
    'pizza', 'burger', 'hot dog', 'sandwich', 'pasta', 'rice', 'bread', 'cake',
    'cookie', 'ice cream', 'candy', 'chocolate', 'coffee', 'tea', 'juice', 'milk',
    'cheese', 'egg', 'chicken', 'fish', 'carrot', 'broccoli', 'tomato', 'potato'
  ],

  // Objects
  objects: [
    'chair', 'table', 'bed', 'door', 'window', 'clock', 'phone', 'computer', 'book',
    'pen', 'pencil', 'scissors', 'hammer', 'screwdriver', 'key', 'lock', 'bag',
    'shoe', 'hat', 'glasses', 'watch', 'ring', 'necklace', 'umbrella', 'balloon',
    'ball', 'bat', 'glove', 'guitar', 'piano', 'drum', 'microphone', 'camera',
    'television', 'radio', 'lamp', 'candle', 'mirror', 'brush', 'comb', 'soap'
  ],

  // Nature & Outdoors
  nature: [
    'tree', 'flower', 'grass', 'mountain', 'river', 'lake', 'ocean', 'beach', 'sand',
    'rock', 'cloud', 'rain', 'snow', 'sun', 'moon', 'star', 'rainbow', 'bridge',
    'house', 'car', 'bus', 'truck', 'bicycle', 'airplane', 'boat', 'ship', 'train',
    'road', 'garden', 'park', 'forest', 'desert', 'island', 'castle', 'church'
  ],

  // Body & People
  body: [
    'head', 'face', 'eye', 'nose', 'mouth', 'ear', 'hair', 'hand', 'finger', 'arm',
    'leg', 'foot', 'heart', 'brain', 'tooth', 'tongue', 'baby', 'child', 'man',
    'woman', 'doctor', 'teacher', 'police', 'firefighter', 'chef', 'artist', 'musician'
  ],

  // Actions & Sports
  actions: [
    'run', 'jump', 'dance', 'sing', 'swim', 'fly', 'climb', 'throw', 'catch', 'kick',
    'hit', 'shoot', 'ride', 'drive', 'walk', 'sleep', 'eat', 'drink', 'read', 'write',
    'draw', 'paint', 'cook', 'clean', 'wash', 'brush', 'cut', 'open', 'close', 'push',
    'pull', 'lift', 'carry', 'build', 'fix', 'play', 'work', 'study', 'laugh', 'cry'
  ],

  // Colors & Shapes
  colors: [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
    'gray', 'circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'diamond'
  ],

  // Household Items
  household: [
    'kitchen', 'bathroom', 'bedroom', 'living room', 'sofa', 'fridge', 'oven', 'sink',
    'toilet', 'shower', 'bathtub', 'washing machine', 'dishwasher', 'vacuum', 'broom',
    'mop', 'sponge', 'towel', 'blanket', 'pillow', 'curtain', 'carpet', 'stair', 'elevator'
  ],

  // Vehicles & Transportation
  vehicles: [
    'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'scooter', 'skateboard', 'roller skates',
    'train', 'subway', 'airplane', 'helicopter', 'boat', 'ship', 'sailboat', 'canoe',
    'rocket', 'spaceship', 'hot air balloon', 'taxi', 'ambulance', 'fire truck', 'police car'
  ],

  // Sports & Games
  sports: [
    'soccer', 'basketball', 'baseball', 'football', 'tennis', 'golf', 'bowling', 'pool',
    'billiards', 'chess', 'checkers', 'cards', 'dice', 'puzzle', 'video game', 'board game',
    'poker', 'blackjack', 'roulette', 'slot machine', 'pinball', 'arcade', 'joystick'
  ],

  // Professions & Jobs
  professions: [
    'teacher', 'doctor', 'nurse', 'dentist', 'pharmacist', 'lawyer', 'judge', 'police',
    'firefighter', 'chef', 'waiter', 'pilot', 'driver', 'mechanic', 'electrician', 'plumber',
    'carpenter', 'painter', 'photographer', 'journalist', 'actor', 'singer', 'dancer',
    'athlete', 'scientist', 'engineer', 'programmer', 'artist', 'musician', 'writer'
  ]
};

// Combined array of all words for random selection
export const ALL_DRAWING_WORDS = Object.values(DRAWING_WORDS).flat();

// Function to get random words from specific categories
export const getRandomWords = (count: number, categories?: string[]): string[] => {
  let wordPool = ALL_DRAWING_WORDS;

  if (categories && categories.length > 0) {
    wordPool = categories
      .filter(cat => DRAWING_WORDS[cat as keyof typeof DRAWING_WORDS])
      .map(cat => DRAWING_WORDS[cat as keyof typeof DRAWING_WORDS])
      .flat();
  }

  // Shuffle and return random words
  const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get words by difficulty (based on word length)
export const getWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): string[] => {
  const easy = ALL_DRAWING_WORDS.filter(word => word.length <= 4);
  const medium = ALL_DRAWING_WORDS.filter(word => word.length >= 5 && word.length <= 7);
  const hard = ALL_DRAWING_WORDS.filter(word => word.length >= 8);

  switch (difficulty) {
    case 'easy': return easy;
    case 'medium': return medium;
    case 'hard': return hard;
    default: return ALL_DRAWING_WORDS;
  }
};

// Function to get a random word
export const getRandomWord = (categories?: string[]): string => {
  const words = getRandomWords(1, categories);
  return words[0] || 'cat'; // fallback to 'cat' if no words found
};

// Export categories for external use
export const WORD_CATEGORIES = Object.keys(DRAWING_WORDS);
