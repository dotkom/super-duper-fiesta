/* This is used to bootstrap a database for this project */
/* eslint no-console: 0 */

const mongoose = require('mongoose');

const addIssue = require('./models/issue').addIssue;
const addUser = require('./models/user').addUser;
const getUserByUsername = require('./models/user').getUserByUsername;
const getActiveQuestion = require('./models/issue').getActiveQuestion;
const addGenfors = require('./models/meeting').addGenfors;
const getActiveGenfors = require('./models/meeting').getActiveGenfors;

const permissionLevel = require('./models/permissions');

require('./models/essentials');

const tearDown = () => {
  mongoose.disconnect();
};

// Checks for an active issue given an AGM, and creates on if none exists.
const getIssue = genfors => new Promise((resolve, reject) => {
  getActiveQuestion(genfors).then((issue) => {
    if (issue) {
      console.log(`Currently active issue: ${issue.description}`);
      resolve('done');
    } else {
      console.log('No currently active issue. Inserting...');
      addIssue({
        genfors,
        description: 'Example Issue #1',
        options: [
          { text: 'Hello' },
          { text: 'World' },
          { text: 'FeelsBadMan' },
        ],
        voteDemand: 0.5,
        qualifiedUsers: 3,
      }).then((insertedIssue) => {
        console.log(`Inserting issue successful => ${insertedIssue.description}`);
        resolve('done');
      }).catch((err) => {
        reject(new Error(`Inserting issue failed => ${err}`));
      });
    }
  }).catch((err) => {
    console.error('Error in getting active issue.', err);
  });
});

const createIssue = (genfors) => {
  getIssue(genfors).then(() => {
    tearDown();
  }).catch((err) => {
    console.error('Something went wrong', err);
    tearDown();
  });
};

// Wrapper function to ensure clean shutdown after getting or inserting issue
const getOrInsertIssue = (genfors) => {
  // Try to find a user with this username already.
  getUserByUsername('admin').then((user) => {
    if (!user || (user && user.name !== 'admin')) {
      // No admin user found, add one.
      console.log('Adding admin user account.');
      addUser('admin', 'admin', permissionLevel.IS_SUPERUSER).then(() => {
        console.log('Admin account created.');
        createIssue(genfors);
      }).catch((err) => {
        console.error('Admin account creation failed.', err);
      });
    } else {
      console.log('Admin account already exists.');
      createIssue(genfors);
    }
  }).catch((error) => {
    console.error('Something went wrong when trying to find out if user exists already.', { error });
  });
};

// Get the currently active genfors, or insert one if none exists.
getActiveGenfors().then((genfors) => {
  if (genfors && genfors.title) {
    console.log(`Currently active genfors: ${genfors.title}`);
    getOrInsertIssue(genfors);
  } else {
    console.log('No active genfors. Inserting...');
    addGenfors('Onlines Generalforsamling 1970',
               new Date('1970-01-01T00:00:00.000Z'), 'my beautiful password hash')
      .then((insertedGenfors) => {
        getOrInsertIssue(insertedGenfors);
      }).catch((err) => {
        console.error('Error in adding genfors.', err);
      });
  }
}).catch((err) => {
  console.error('Error in getting active genfors.', err);
});
