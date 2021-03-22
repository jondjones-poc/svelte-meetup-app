import { writable } from 'svelte/store'

const meetups = writable([]);
// id: 1,
// title: 'Learn How To Drink',
// subTitle: 'Learn how to skull beer',
// description: 'Blah',
// imageUrl: 'https://images.unsplash.com/photo-1611095973763-414019e72400?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3902&q=80',
// address: '1 Test Street, Test Avenue, Test City',
// email: 'test"test.com',
// isFavourite: false

const meetupStore = {
  subscribe: meetups.subscribe,
  addMeetup: (meetupData) => {
    const newMeetup = {
      ...meetupData,
      id: Math.random(),
      isFavourite: false
    };
    meetups.update(items => {
      return [newMeetup, ...items];
    })
  },
  setMeetups: (meetupArray) => {
    meetups.set(meetupArray)
  },
  toogleFavourite: (id) => {
      meetups.update(items => {
        const updatedMeetup = {...items.find(m => m.id === id)};
        updatedMeetup.isFavourite = !updatedMeetup.isFavourite;
        const meetupIndex = items.findIndex(m => m.id === id);
        const updatedMeetups = [...items];
        updatedMeetups[meetupIndex] = updatedMeetup;
        return updatedMeetups;
      });
    },
    updateMeetup: (id, meetup) => {
      meetups.update(items => {
        const meetupIndex = items.findIndex(m => m.id === id);
        const updatedMeetup =  {...items[meetupIndex], ...meetup};
        const updatedMeetups = [...items];
        updatedMeetups[meetupIndex] = updatedMeetup;
        return updatedMeetups;
      });  
    },
    deleteMeetup: (id) => {
      console.log('Delete', id)
      meetups.update(items => {
        return items.filter(item => item.id !== id);
      });
    }
}

export default meetupStore;