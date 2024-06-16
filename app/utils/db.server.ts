import crypto from 'crypto';
import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data';
import { getOrCreateSingleton } from './singleton.server';

const getId = () => crypto.randomBytes(16).toString('hex').slice(0, 8);

export const db = getOrCreateSingleton('db', () => {
  // Create a new "user" and "remark" models
  const db = factory({
    user: {
      id: primaryKey(getId),
      email: String,
      username: String,
      name: nullable(String),

      createdAt: () => new Date(),

      remarks: manyOf('remark'),
    },
    remark: {
      id: primaryKey(getId),
      title: String,
      content: String,

      createdAt: () => new Date(),

      owner: oneOf('user'),
    },
  });

  // Seeding: create an entity of a particular model(user) by calling the .create() method
  const henghao = db.user.create({
    id: 'f7c0e59f5ffccf157d0ab6b1a946d132',
    email: 'henghao@hpu.dev',
    username: 'henghao',
    name: 'Heng-Hao',
  });

  const henghaoRemarks = [
    {
      id: 'f7c0e59f',
      title: 'Hello, world!',
      content: 'This is my first remark.',
    },
    {
      id: '5ffccf15',
      title: 'Hello, again!',
      content: 'This is my second remark.',
    },
    {
      id: '7d0ab6b1',
      title: 'Hello, one more time!(3)',
      content: 'This is my third remark.',
    },
    {
      id: 'a946d132',
      title: 'Hello, one more time!(4)',
      content: 'This is my fourth remark.',
    },
    {
      id: 'a946d133',
      title: 'Hello, one more time!(5)',
      content: 'This is my fifth remark.',
    },
    {
      id: 'a946d134',
      title: 'Hello, one more time!(6)',
      content: 'This is my sixth remark.',
    },
    {
      id: 'a946d135',
      title: 'Hello, one more time!(7)',
      content: 'This is my seventh remark.',
    },
    {
      id: 'a946d136',
      title: 'Hello, one more time!(8)',
      content: 'This is my eighth remark.',
    },
    {
      id: 'a946d137',
      title: 'Hello, one more time!(9)',
      content: 'This is my ninth remark. '.repeat(500),
    },
    {
      id: 'a946d138',
      title: 'Hello, one more time!(10)',
      content: 'This is my tenth remark. '.repeat(500),
    },
    // extra long note to test scrolling
    {
      id: 'a946d139',
      title: 'Hello, one more time!(11)',
      content: 'This is my eleventh remark. '.repeat(500),
    },
  ];

  henghaoRemarks.forEach(remark => {
    db.remark.create({
      ...remark,
      owner: henghao,
    });
  });

  return db;
});
