import { faker } from '@faker-js/faker';
import PocketBase from 'pocketbase';

const LADDER_ID = 'q7zdq4tuc0rgiln';
const PARTICIPANT_COUNT = 5;

const pb = new PocketBase('http://127.0.0.1:8090');

const authData = await pb
  .collection('users')
  .authWithPassword('admin@delemstudios.com', 'RogerThat!23');

const generateParticipants = async () => {
  const participants = [];

  for (const _ of Array(PARTICIPANT_COUNT)) {
    const user = await pb.collection('users').create({
      email: faker.internet.email(),
      password: '12345678',
      passwordConfirm: '12345678',
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    });

    console.log('Generated user:', user);

    participants.push(user.id);
  }

  for (const participantId of participants) {
    await pb
      .collection('participants')
      .create({ ladder: LADDER_ID, primaryPlayer: participantId });
  }

  // "logout" the last authenticated account
  pb.authStore.clear();
};

generateParticipants();
