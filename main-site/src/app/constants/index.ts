const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const names = [
    "James", "Michael", "Robert", "John", "David",
    "William", "Joseph", "Thomas", "Charles", "Daniel",
    "Matthew", "Anthony", "Mark", "Donald", "Steven",
    "Paul", "Andrew", "Joshua", "Kenneth", "Kevin",
    "Brian", "George", "Edward", "Ronald", "Timothy",
    "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
    "Nicholas", "Eric", "Jonathan", "Stephen", "Larry",
    "Justin", "Scott", "Brandon", "Benjamin", "Samuel",
    "Gregory", "Frank", "Alexander", "Raymond", "Patrick",
    "Jack", "Dennis", "Jerry", "Tyler", "Aaron"
];

const listOfRooms = [
    "Chill Zone",
    "Midnight Lounge",
    "Code Cave",
    "Pixel Palace",
    "Vibe Station",
    "The Hangout",
    "Cosmic Chat",
    "The Dev Den",
    "Late Night Talks",
    "Neon Room",
    "Dream Hub",
    "The Coffee Club",
    "Digital Campfire",
    "Brainstorm Bay",
    "The Think Tank",
    "After Hours",
    "Skyline Room",
    "Infinite Loop",
    "Zen Space",
    "The Playground",
    "Galaxy Hub",
    "The Lab",
    "Cloud Nine",
    "Focus Room",
    "Creative Corner",
    "The Basement",
    "The Attic",
    "Alpha Room",
    "Beta Room",
    "Gamma Lounge",
    "Delta Den",
    "Omega Space",
    "The Sandbox",
    "Chatter Box",
    "Echo Chamber",
    "The Dock",
    "Harbor Hangout",
    "Fireplace Talks",
    "The Retreat",
    "Sunset Lounge",
    "Moonlight Room",
    "Aurora Hub",
    "The Hive",
    "Spark Space",
    "The Loft",
    "Caffeine Corner",
    "Quiet Corner",
    "The Arena",
    "The Summit",
    "Open Space"
];

const EditorTheme = [
    { id: "vs-dark", themeName: "Dark Modern" },
    { id: "vs", themeName: "Vs-White Modern" },
    { id: "hc-black", themeName: "Dark High Contrast" },

]

const menu = [
    "Your Codeshares",
    "New Codeshare",
    "Account Settings",
    "Log Out",
  ];

const defaultLangType = { id: "plaintext", langName: "Plain Text", ext: ".txt" };
const allowedMembers = [2, 4, 6, 8];
const membersLimit = 2;


export {
    EditorTheme,
    defaultLangType,
    membersLimit,
    allowedMembers,
    ALPHABET,
    listOfRooms,
    names,
    menu,
}