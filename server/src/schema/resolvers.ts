import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { IResolvers } from '@graphql-tools/utils';

export const resolvers: IResolvers = {
  Query: {
    hello: () => 'Hello, world!',
    me: async (_parent, _args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (_parent, args) => {
      const user = await User.create(args);
      const token = signToken(
        JSON.stringify({ username: user.username, email: user.email, _id: user._id }),
        process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is not defined in environment variables'); })(),
        { expiresIn: '1h' }
      );
      return { token, user };
    },

    login: async (_parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(
        JSON.stringify({ username: user.username, email: user.email, _id: user._id }),
        process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is not defined in environment variables'); })(),
        { expiresIn: '1h' }
      );
      return { token, user };
    },

    saveBook: async (_parent, { input }, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to save a book');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    removeBook: async (_parent, { bookId }, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to remove a book');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return updatedUser;
    },
  },
};
