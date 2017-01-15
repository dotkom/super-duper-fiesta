const issue = (state = {}, action, currentIssue) => {
  switch (action.type) {
    case 'CREATE_ISSUE':
      return {
        id: action.id,
        text: action.text,
        alternatives: action.alternatives,
        votes: [],
        resolutionType: action.resolutionType,
      };

    case 'SEND_VOTE':
      // If the vote has been cancelled before this vote was submitted, it needs
      // to be discarded. We also skip it if this is not the current issue.
      if (state.id !== currentIssue || state.id !== action.id) {
        return state;
      }

      return {
        ...state,

        votes: [
          ...state.votes,

          {
            alternative: action.alternative,
            voter: action.voter,
          },
        ],
      };

    case 'RECEIVE_VOTE':
      if (state.id !== currentIssue || state.id !== action.id) {
        return state;
      }

      return {
        ...state,

        votes: [
          ...state.votes,

          {
            alternative: action.alternative,
            voter: action.voter,
          },
        ],
      };

    default:
      return state;
  }
};

const defaultIssues = [{
  id: 0,
  text: 'Trump',
  alternatives: [{
    id: 0,
    text: 'yes',
  }],

  votes: [],

  majorityTreshold: 0.5,
  isActive: false,
}, {
  id: 1,
  text: 'YO hello this is long text',
  alternatives: [{
    id: 0,
    text: 'yes',
  }, {
    id: 1,
    text: 'yes',
  }, {
    id: 2,
    text: 'yes',
  }],

  votes: [],

  majorityTreshold: 0.5,
  isActive: false,
}, {
  id: 2,
  text: 'Half-giant jinxes peg-leg gillywater broken glasses large black dog Great Hall. Nearly-Headless Nick now string them together, and answer me this, which creature would you be unwilling to kiss? Poltergeist sticking charm, troll umbrella stand flying cars golden locket Lily Potter. Pumpkin juice Trevor wave your wand out glass orbs, a Grim knitted hats. Stan Shunpike doe patronus, suck his soul Muggle-Born large order of drills the trace. Bred in captivity fell through the veil, quaffle blue flame ickle diddykins Aragog. Yer a wizard, Harry Doxycide the woes of Mrs. Weasley Goblet of Fire',
  alternatives: [{
    id: 0,
    text: 'Yes',
  }, {
    id: 1,
    text: 'No',
  }, {
    id: 2,
    text: 'I don\'t like voting',
  }],

  votes: [],

  majorityTreshold: 0.5,
  isActive: false,
}];

const issues = (state = defaultIssues, action) => {
  switch (action.type) {
    case 'CREATE_ISSUE':
      return [
        ...state,
        issue(undefined, action),
      ];

    case 'SEND_VOTE':
      return state.map(i => issue(i, action, state[state.length - 1].id));

    case 'RECEIVE_VOTE':
      return state.map(i => issue(i, action, state[state.length - 1].id));

    default:
      return state;
  }
};

export default issues;
