import User from "../models/User";
import Rank from "../models/Rank";
import { Request, Response } from 'express';
import { USER_MESSAGES, RANK_MESSAGES } from '../consts/Messages';

export const create = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email && !password) {
    return res.status(422).json({ msg: USER_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED })
  }

  const userExist = await User.findOne({ email: email })

  if (userExist) {
    return res.status(422).json({ msg: USER_MESSAGES.EMAIL_ALREADY_EXISTS })
  }
  const defaultRank = await Rank.findOne({ rank: "Bronze" });

  const user = new User({
    email: email,
    password: password,
    rank: defaultRank?._id
  });

  try {
    await user.save()
    res.status(201).json({ msg: USER_MESSAGES.USER_SAVED_SUCCESSFULLY, user: user })

  } catch (error) {
    res.status(500).json({ msg: USER_MESSAGES.ERROR_SAVING_USER, error })
  }
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const oldRankPoints = await User.findById(id).select('rankPoints rank');
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: USER_MESSAGES.USER_NOT_FOUND });
    }

    const findRank = await Rank.findById(updatedUser.rank);

    if (!findRank) {
      return res.status(404).json({ message: RANK_MESSAGES.RANK_NOT_FOUND });
    }

    if (updatedUser.rankPoints >= findRank.requiredPoints) {
      const newRank = await Rank.findOne({ rank: findRank?.nextRank });

      if (updatedUser.rankPoints <= findRank.requiredPoints) {
        await updatedUser.updateOne({ rank: newRank?._id });
      } else {
        updatedUser.set({ rankPoints: oldRankPoints?.rankPoints });
        await updatedUser.save();
        throw new Error(RANK_MESSAGES.ERROR_UPDATING_RANK);
      }
    }
    return res.json({ message: USER_MESSAGES.USER_UPDATED_SUCCESSFULLY, user: updatedUser });
  } catch (error) {
    console.error(RANK_MESSAGES.ERROR_UPDATING_RANK, error);
    return res.status(500).json({ message: USER_MESSAGES.ERROR_UPDATING_USER, error });
  }
};

export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });
    }

    res.json(user);

  } catch (error) {
    return res.status(500).json({ msg: USER_MESSAGES.USER_NOT_FOUND, error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });
    }
    return res.status(200).json({ msg: USER_MESSAGES.USER_DELETED_SUCCESSFULLY });
  } catch (error) {
    return res.status(500).json({ msg: USER_MESSAGES.ERROR_DELETING_USER, error });
  }
}