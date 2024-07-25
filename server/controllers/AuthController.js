import getPrismaInstance from "../utils/PrismaClient.js";

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
    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture) {
      return res.json({ message: "All fields are required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
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
        about: true,
        profilePicture: true,
      },
    });
    const usersGroupByFirstLetter = {};

    users.forEach((user) => {
      const firstLetter = user.name[0].toUpperCase();
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
