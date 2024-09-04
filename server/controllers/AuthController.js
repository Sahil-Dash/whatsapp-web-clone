import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ message: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: "User not found", status: false });
    } else {
      return res.json({ message: "User found", status: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, userName, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture || !userName) {
      return res.json({ message: "All fields are required", status: false });
    }

    console.log(name, userName, email);
    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, userName, about, profilePicture },
    });
    return res.json({
      message: "User unboarded successfully",
      status: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        userName: true,
        about: true,
        profilePicture: true,
      },
    });
    console.log(users);
    const usersGroupByFirstLetter = {};

    users.forEach((user) => {
      const firstLetter = user.userName[0].toUpperCase();
      if (!usersGroupByFirstLetter[firstLetter]) {
        usersGroupByFirstLetter[firstLetter] = [];
      }
      usersGroupByFirstLetter[firstLetter].push(user);
    });
    res.json({ status: true, users: usersGroupByFirstLetter });
  } catch (error) {
    next(error);
  }
};

export const generateToken = (req, res, next) => {
  try {
    console.log("generate-token");
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER;
    const { userId } = req.params;
    const effectiveTime = 3600;
    const payload = "";

    console.log(appId, serverSecret, userId);

    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );

      return res.status(200).json({ token });
    }
    return res
      .status(400)
      .json({ message: " app ID , userId and server secret required" });
  } catch (error) {
    next(error);
  }
};
