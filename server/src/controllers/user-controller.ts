import type { Request, Response } from 'express';
import User from '../models/User';
import { signToken } from '../services/auth';

export const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser = await User.findOne({
      $or: [{ _id: req.user?._id || req.params.id }, { username: req.params.username }],
    });

    if (!foundUser) {
      res.status(400).json({ message: 'Cannot find a user with this id!' });
      return;
    }

    res.json(foundUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      res.status(400).json({ message: 'Something is wrong!' });
      return;
    }
    const token = signToken(user.username, user.password, user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (!user) {
      res.status(400).json({ message: "Can't find this user" });
      return;
    }

    const correctPw = await user.isCorrectPassword(req.body.password);
    if (!correctPw) {
      res.status(400).json({ message: 'Wrong password!' });
      return;
    }

    const token = signToken(user.username, user.password, user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error saving book', error: err });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Couldn't find user with this id!" });
      return;
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error deleting book', error: err });
  }
};
